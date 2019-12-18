import { Component, OnInit } from '@angular/core';
import { ITask } from './task'
import { ActivatedRoute, Router } from '@angular/router'
import { TaskService } from './task.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';


@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent implements OnInit {  
  errorMessage:string='';
  task: ITask | undefined;
  editForm: FormGroup;

  constructor(private route: ActivatedRoute, 
    private router: Router, private taskservice: TaskService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    const param=this.route.snapshot.paramMap.get('id');
    if(param){
      const id =+param;
      this.getTaskDetail(id);
    }
    
    this.editForm = this.formBuilder.group({
      Task_ID: [''],
      Task1: ['', Validators.required],
      Priority: ['', Validators.required],
      Parent_ID: [''],
      Start_Date: ['', Validators.required],
      End_Date: ['', Validators.required],
      isTaskComplete: ['', Validators.required]
    });
  }

  getTaskDetail(id: number){
    this.taskservice.getTaskDetail(id).subscribe(
      data => {
        this.editForm.setValue(data);
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

  onCancel():void{
    this.router.navigate(['/tasks']);
  }
}
