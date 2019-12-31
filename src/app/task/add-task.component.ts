import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TaskService } from './task.service';
import { ProjectService } from '../project/project.service';
import { IProject } from '../project/project';
import { ITask } from './task';
import { formatDate } from '@angular/common';
import { IUser } from '../user/user';
import { UserService } from '../user/user.service';


@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {
  errorMessage: string = '';
  display: string;
  projects: IProject[];
  filterProjects: IProject[];
  selectedProjectID: number;
  selectedProjectName: string;
  selectedTaskID: number;
  selectedTaskName: string;
  disableControls: boolean = false;
  selectedSearch: string;
  tasks: ITask[];
  filterTasks: ITask[];
  currentDate: string;
  date: Date;
  users: IUser[];
  filterUsers: IUser[];
  selectedUserName: string;
  selectedUserID: number;
  parentTaskIndicator: boolean;

  constructor(private router: Router, private userService: UserService, private taskService: TaskService, private projectService: ProjectService, private route: ActivatedRoute, private formBuilder: FormBuilder) { }

  addForm: FormGroup;
  addParentForm: FormGroup;
  updateUserForm:FormGroup;

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      disableControls: [''],
      Task1: ['', Validators.required],
      Priority: ['0', Validators.required],
      Parent_ID: [''],
      ParentTask: [''],
      Start_Date: ['', Validators.required],
      End_Date: ['', Validators.required],
      Project: [''],
      User: [''],
      Project_ID: [''],
    });

    this.addParentForm = this.formBuilder.group({
      Parent_Task: ['']
    });

    this.updateUserForm=this.formBuilder.group({
      Project_ID:['']
    });

    this.currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.addForm.controls['Start_Date'].patchValue(this.currentDate);
    this.date = new Date();
    this.date.setDate(this.date.getDate() + 1);
    this.currentDate = formatDate(this.date, 'yyyy-MM-dd', 'en');
    this.addForm.controls['End_Date'].patchValue(this.currentDate);
  }

  private _taskNameFilter: string;
  public get taskNameFilter(): string {
    return this._taskNameFilter;
  }
  public set taskNameFilter(v: string) {
    this._taskNameFilter = v;
    this.filterTasks = this._taskNameFilter ? this.performTaskNameFilter(this._taskNameFilter) : this.tasks;
  }

  private _projectNameFilter: string;
  public get projectNameFilter(): string {
    return this._projectNameFilter;
  }
  public set projectNameFilter(v: string) {
    this._projectNameFilter = v;
    this.filterProjects = this._projectNameFilter ? this.performProjectNameFilter(this._projectNameFilter) : this.projects;
  }

  private _userNameFilter: string;
  public get userNameFilter(): string {
    return this._userNameFilter;
  }
  public set userNameFilter(v: string) {
    this._userNameFilter = v;
    this.filterUsers = this._userNameFilter ? this.performUserNameFilter(this._userNameFilter) : this.users;
  }

  onSubmit(): void {
    const taskName = this.addForm.get('Task1').value;
    const priority = this.addForm.get('Priority').value;
    const startDate = this.addForm.get('Start_Date').value;
    const endDate = this.addForm.get('End_Date').value;
    

    if (taskName == "" || priority == "" || startDate == "" || endDate == "") {
      alert('Please provide all the mandatory deatils: Task name, Priority, Start Date and End Date to add a new task!');
    }
    else if (startDate > endDate) {
      alert('End date cannot be before Start date!');
    }
    else {
      this.taskService.createTask(this.addForm.value)
        .subscribe(data => {
          this.router.navigate(['/tasks']);
        });

      if (this.parentTaskIndicator) {
        this.addParentForm.controls['Parent_Task'].setValue(taskName);
        this.taskService.createParentTask(this.addParentForm.value).subscribe(data => {
          this.router.navigate(['/tasks']);
        });
      }

      if (this.selectedProjectID && this.selectedUserID) {
        this.userService.updateUserProject(this.selectedUserID,this.updateUserForm.value).subscribe(data => {
          this.router.navigate(['/tasks']);
        });
      }
    }
  }

  performProjectNameFilter(filterBy: string): IProject[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.projects.filter((projects: IProject) => projects.Project1.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  performTaskNameFilter(filterBy: string): ITask[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.tasks.filter((tasks: ITask) => tasks.Task1.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  performUserNameFilter(filterBy: string): IUser[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.users.filter((users: IUser) => users.FirstName.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  openModalDialog(searchFilter: string) {
    if (searchFilter == 'projects') {
      this.selectedSearch = 'projects';
      this.display = 'block'; //Set block css
      this.projectService.getProjects().subscribe({
        next: projects => {
          this.projects = projects;
          this.filterProjects = this.projects;
        },
        error: err => (this.errorMessage = err)
      });
    }
    else if (searchFilter == 'tasks') {
      this.selectedSearch = 'tasks';
      this.display = 'block'; //Set block css
      this.taskService.getTasks().subscribe({
        next: tasks => {
          this.tasks = tasks;
          this.filterTasks = this.tasks;
        },
        error: err => (this.errorMessage = err)
      });
    }
    else if (searchFilter == 'users') {
      this.selectedSearch = 'users';
      this.display = 'block'; //Set block css
      this.userService.getUsers().subscribe({
        next: users => {
          this.users = users;
          this.filterUsers = this.users;
        },
        error: err => (this.errorMessage = err)
      });
    }
  }

  closeModalDialog() {
    this.display = 'none'; //set none css after close dialog
  }

  createParentTask() {
    this.disableControls = !this.disableControls;
    this.parentTaskIndicator = true;
    if (this.disableControls) {
      this.addForm.get('Priority').disable();
      this.addForm.get('ParentTask').disable();
      this.addForm.get('Start_Date').disable();
      this.addForm.get('End_Date').disable();
      document.getElementById('SearchTask').setAttribute('disabled', 'true');
      document.getElementById('SearchUser').setAttribute('disabled', 'true');
    }
    else {
      this.addForm.get('Priority').enable();
      this.addForm.get('Start_Date').enable();
      this.addForm.get('End_Date').enable();
      document.getElementById('SearchTask').removeAttribute('disabled');
      document.getElementById('SearchUser').removeAttribute('disabled');
    }
  }

  selectProject(project: IProject): void {
    this.selectedProjectID = project.Project_ID;
    this.selectedProjectName = project.Project1;
    this.addForm.get('Project').setValue(this.selectedProjectName);
    this.addForm.get('Project_ID').setValue(this.selectedProjectID);
    this.updateUserForm.get('Project_ID').setValue(this.selectedProjectID);
  }

  selectTask(task: ITask): void {
    this.selectedTaskID = task.Task_ID;
    this.selectedTaskName = task.Task1;
    this.addForm.get('ParentTask').setValue(this.selectedTaskName);
    this.addForm.get('Parent_ID').setValue(this.selectedTaskID);
  }

  selectUser(user: IUser): void {
    this.selectedUserID = user.User_ID;
    this.selectedUserName = user.FirstName + " " + user.LastName;
    this.addForm.get('User').setValue(this.selectedUserName);    
  }

  onReset(): void {
    //this.addForm.reset({Task1:'',Parent_ID:'',Start_Date:'',End_Date:''});
    window.location.reload();
  }
}
