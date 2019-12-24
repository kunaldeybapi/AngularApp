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
      Task1: ['', Validators.required],
      Priority: ['', Validators.required],
      Parent_ID: [''],
      Start_Date: ['', Validators.required],
      End_Date: ['', Validators.required]
    });    
  }  

  onSubmit():void {
    const taskName=this.addForm.get('Task1').value;
    const priority=this.addForm.get('Priority').value;    
    const startDate=this.addForm.get('Start_Date').value;
    const endDate=this.addForm.get('End_Date').value;

    if(taskName== "" || priority == "" || startDate == "" || endDate == ""){
      alert('Please provide all the mandatory deatils: Task name, Priority, Start Date and End Date to add a new task!');
    }
    else{
      this.taskService.createTask(this.addForm.value)
      .subscribe( data => {
        this.router.navigate(['/tasks']);
      });
    }    
  }  

  onReset():void{
    this.addForm.reset({Task1:'',Parent_ID:'',Start_Date:'',End_Date:''});
  }
}
