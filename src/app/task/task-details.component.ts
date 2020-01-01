import { Component, OnInit } from '@angular/core';
import { ITask } from './task'
import { ActivatedRoute, Router } from '@angular/router'
import { TaskService } from './task.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { UserService } from '../user/user.service';
import { IUser } from '../user/user';
import { IProject } from '../project/project';
import { ProjectService } from '../project/project.service';


@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent implements OnInit {
  errorMessage: string = '';
  task: ITask | undefined;
  editForm: FormGroup;
  display: string;
  selectedSearch: string;
  users: IUser[];
  filterUsers: IUser[];
  selectedUserID: number;
  selectedUserName: string;
  projects: IProject[];
  projectID: number;

  constructor(private route: ActivatedRoute,
    private router: Router, private taskservice: TaskService, private projectService: ProjectService, private userService: UserService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.editForm = this.formBuilder.group({
      Task_ID: [''],
      Task1: ['', Validators.required],
      Priority: ['', Validators.required],
      Parent_ID: [''],
      Start_Date: ['', Validators.required],
      End_Date: ['', Validators.required],
      isTaskComplete: ['', Validators.required],
      Project_ID: [''],
      User_ID: ['']
    });

    const param = this.route.snapshot.paramMap.get('id');
    if (param) {
      const id = +param;
      this.getTaskDetail(id);
    }
  }

  getProjectName(projectID: number) {
    this.projectService.getProjectDetail(projectID).subscribe(
      data => {
        this.editForm.controls['Project_ID'].setValue(data.Project1);
      }
    );
  }


  private _userNameFilter: string;
  public get userNameFilter(): string {
    return this._userNameFilter;
  }
  public set userNameFilter(v: string) {
    this._userNameFilter = v;
    this.filterUsers = this._userNameFilter ? this.performUserNameFilter(this._userNameFilter) : this.users;
  }

  performUserNameFilter(filterBy: string): IUser[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.users.filter((users: IUser) => users.FirstName.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }


  getTaskDetail(id: number) {
    this.taskservice.getTaskDetail(id).subscribe(
      data => {
        this.editForm.get('Task_ID').setValue(data.Task_ID);
        this.editForm.get('Task1').setValue(data.Task1);
        this.editForm.get('Project_ID').setValue(data.Project_ID);
        localStorage.removeItem("projectid");
        localStorage.setItem("projectid", data.Project_ID.toString());
        this.projectID = +localStorage.getItem('projectid');
        this.getProjectName(this.projectID);
        this.editForm.get('Priority').setValue(data.Priority);
        this.editForm.get('Parent_ID').setValue(data.Parent_ID);
        this.editForm.get('Start_Date').setValue(data.Start_Date);
        this.editForm.get('End_Date').setValue(data.End_Date);
      });
  }

  onSubmit() {
    this.taskservice.updateTask(this.editForm.get('Task_ID').value, this.editForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(['/tasks']);
        },
        error => {
          alert(error);
        });
  }

  openModalDialog(searchFilter: string) {
    if (searchFilter == 'users') {
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

  selectUser(user: IUser): void {
    this.selectedUserID = user.User_ID;
    this.selectedUserName = user.FirstName + " " + user.LastName;
    this.editForm.get('User').setValue(this.selectedUserName);
  }

  onCancel(): void {
    this.router.navigate(['/tasks']);
  }
}
