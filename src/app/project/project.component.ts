import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from './project.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { UserService } from '../user/user.service';
import { IUser } from '../user/user';
import { IProject } from './project';
import { IParentTask } from '../task/parentTask';
import { ITask } from '../task/task';
import { TaskService } from '../task/task.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  display: string;
  currentDate: string;
  date: Date;
  datesDisabled: boolean = true;
  errorMessage: string = '';
  addProjectForm: FormGroup;
  filterUsers: IUser[];
  users: IUser[] = [];
  selectedUserID: number;
  selectedUserName: string;
  projects: IProject[];
  filterProjects: IProject[];
  tasks: ITask[];
  taskCount: number;
  completedTaskCount: number;

  constructor(private router: Router, private taskService: TaskService, private projectService: ProjectService, private userService: UserService, private route: ActivatedRoute, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.taskService.getTasks().subscribe({
      next: data => {
        this.tasks = data;
      }
    });

    this.projectService.getProjects().subscribe({
      next: projects => {
        this.projects = projects;
        this.filterProjects = this.projects;
        this.getTaskCount();
      },
      error: err => (this.errorMessage = err)
    });

    this.addProjectForm = this.formBuilder.group({
      enableDates: [''],
      Project1: ['', Validators.required],
      Start_Date: ['', Validators.required],
      End_Date: ['', Validators.required],
      Priority: ['0', Validators.required],
      Manager: ['', Validators.required],
    });
  }

  getTaskCount() {
    for (let i = 0; i < this.projects.length; i++) {
      this.taskCount = 0;
      this.completedTaskCount = 0;
      for (let j = 0; j < this.tasks.length; j++) {
        if (this.projects[i].Project_ID == this.tasks[j].Project_ID) {
          this.taskCount++;
          if (this.tasks[j].isTaskComplete == true) {
            this.completedTaskCount++;
          }
        }
      }
      this.projects[i].TaskCount = this.taskCount;
      this.projects[i].CompletedTaskCount = this.completedTaskCount;
    }
  }

  private _userNameFilter: string;
  public get userNameFilter(): string {
    return this._userNameFilter;
  }
  public set userNameFilter(v: string) {
    this._userNameFilter = v;
    this.filterUsers = this._userNameFilter ? this.performUserNameFilter(this._userNameFilter) : this.users;
  }


  private _projectNameFilter: string;
  public get projectNameFilter(): string {
    return this._projectNameFilter;
  }
  public set projectNameFilter(v: string) {
    this._projectNameFilter = v;
    this.filterProjects = this._projectNameFilter ? this.performProjectNameFilter(this._projectNameFilter) : this.projects;
  }


  onSubmit(): void {
    const projectName = this.addProjectForm.get('Project1').value;
    const startDate = this.addProjectForm.get('Start_Date').value;
    const endDate = this.addProjectForm.get('End_Date').value;

    if (projectName == "") {
      alert('Please fill in all the mandatory field(s): Project to add a new project!');
    }
    else if (startDate > endDate) {
      alert('End date cannot be before Start date!');
    }
    else {
      var action = "";
      action = document.getElementById('AddorUpdate').innerHTML.toLocaleLowerCase();
      if (action == "add") {
        this.projectService.createProject(this.addProjectForm.value).subscribe(data => {
          window.location.reload();
        });
      }
    }
  }

  EnableDates(): void {
    this.datesDisabled = !this.datesDisabled;
    if (this.datesDisabled) {
      this.addProjectForm.get('Start_Date').disable();
      this.addProjectForm.get('End_Date').disable();
      this.addProjectForm.controls['Start_Date'].setValue('');
      this.addProjectForm.controls['End_Date'].setValue('');
    }
    else {
      this.currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
      this.addProjectForm.get('Start_Date').enable();
      this.addProjectForm.controls['Start_Date'].patchValue(this.currentDate);

      this.date = new Date();
      this.date.setDate(this.date.getDate() + 1);
      this.currentDate = formatDate(this.date, 'yyyy-MM-dd', 'en');
      this.addProjectForm.get('End_Date').enable();
      this.addProjectForm.controls['End_Date'].patchValue(this.currentDate);
    }
  }

  openModalDialog() {
    this.display = 'block'; //Set block css
    this.userService.getUsers().subscribe({
      next: users => {
        this.users = users;
        this.filterUsers = this.users;
      },
      error: err => (this.errorMessage = err)
    });
  }

  performUserNameFilter(filterBy: string): IUser[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.users.filter((users: IUser) => users.FirstName.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  performProjectNameFilter(filterBy: string): IProject[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.projects.filter((projects: IProject) => projects.Project1.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  selectUser(user: IUser): void {
    this.selectedUserID = user.User_ID;
    this.selectedUserName = user.FirstName + ' ' + user.LastName;
    this.addProjectForm.get('Manager').setValue(this.selectedUserName);
  }

  closeModalDialog() {
    this.display = 'none'; //set none css after close dialog
  }

  sortProjectData(sortValue: string): void {
    if (sortValue === 'startDate') {
      this.projects.sort(this.sortByStartDate);
    }
    else if (sortValue === 'endDate') {
      this.projects.sort(this.sortByEndDate);
    }
    else if (sortValue === 'priority') {
      this.projects.sort(this.sortByPriority);
    }
    else if (sortValue === 'status') {
      this.projects.sort(this.sortByTaskCompletion);
    }
  }

  sortByStartDate(a: IProject, b: IProject) {
    if (a.Start_Date < b.End_Date) {
      return -1;
    } else if (a.Start_Date > b.End_Date) {
      return 1;
    } else {
      return 0;
    }
  }

  sortByEndDate(a: IProject, b: IProject) {
    if (a.End_Date < b.End_Date) {
      return -1;
    } else if (a.End_Date > b.End_Date) {
      return 1;
    } else {
      return 0;
    }
  }

  sortByPriority(a: IProject, b: IProject) {
    if (a.Priority < b.Priority) {
      return -1;
    } else if (a.Priority > b.Priority) {
      return 1;
    } else {
      return 0;
    }
  }

  sortByTaskCompletion(a: IProject, b: IProject) {
    if (a.CompletedTaskCount < b.CompletedTaskCount) {
      return -1;
    } else if (a.CompletedTaskCount > b.CompletedTaskCount) {
      return 1;
    } else {
      return 0;
    }
  }

  completeProject(id: number) {
    this.projectService.completeProject(id).subscribe(data => {
      console.log('Selected Project ID: ' + id);
      window.location.reload();
    });
  }

  updateProject(id:number) {
    this.projectService.getProjectDetail(id).subscribe(
      data=>{
        this.addProjectForm.controls['Project1'].setValue(data.Project1);
        this.addProjectForm.controls['Start_Date'].setValue(data.Start_Date);
        this.addProjectForm.controls['End_Date'].setValue(data.End_Date);
        this.addProjectForm.controls['Priority'].setValue(data.Priority);
        document.getElementById('Start_Date').removeAttribute('disabled');
        document.getElementById('End_Date').removeAttribute('disabled');
        document.getElementById('enableDates').setAttribute('disabled', 'true');       
      }
    );
  }

  Reset(): void {
    window.location.reload();
  }
}
