import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { TaskService } from './task.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {  
  errorMessage:string='';

  constructor(private router: Router, private taskService: TaskService, private route: ActivatedRoute,private formBuilder: FormBuilder) { }

  addForm: FormGroup;

  ngOnInit() {
    this.addForm = this.formBuilder.group({            
      task: ['', Validators.required],
      priority: ['', Validators.required],
      parentTask: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });    
  }  

  onSubmit() {
    const taskName=this.addForm.get('task').value;
    const priority=this.addForm.get('priority').value;    
    const startDate=this.addForm.get('startDate').value;
    const endDate=this.addForm.get('endDate').value;

    if(taskName== "" || priority == "" || startDate == "" || endDate == ""){
      alert('Please provide all the mandatory deatils: task name, priority, start date and end date to add a new task!');
    }
    else{
      this.taskService.createTask(this.addForm.value)
      .subscribe( data => {
        this.router.navigate(['/tasks']);
      });
    }    
  }  

  onReset():void{
    this.addForm.reset();
  }
}
