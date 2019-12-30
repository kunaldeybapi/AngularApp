import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from './project.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  datesDisabled:boolean=true;
  errorMessage:string='';
  addProjectForm:FormGroup;

  constructor(private router: Router, private projectService: ProjectService, private route: ActivatedRoute,private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.addProjectForm = this.formBuilder.group({
      enableDates: [''],
      Project1: ['', Validators.required],
      Start_Date: ['', Validators.required],
      End_Date: ['',Validators.required],
      Priority: ['0',Validators.required]      
    });
  }

  onSubmit():void {
    const projectName=this.addProjectForm.get('Project1').value;   

    if(projectName== ""){
      alert('Please fill in all the mandatory details: First name, Last name & Employee ID to add a new user!');
    }
    else{
      var action="";
      action=document.getElementById('AddorUpdate').innerHTML.toLocaleLowerCase();
      if(action=="add"){
          this.projectService.createProject(this.addProjectForm.value).subscribe( data => {
          window.location.reload();
      });
    }
    //   if(action=="update"){
    //       this.projectService.updateUser(this.selectedUserID,this.addUserForm.value).pipe(first()).subscribe( data => {
    //       window.location.reload();
    //   })
    // }                
  }
}

  EnableDates():void{
    this.datesDisabled=!this.datesDisabled;        
    if(this.datesDisabled){
      document.getElementById('Start_Date').setAttribute('disabled', 'false');
      document.getElementById('End_Date').setAttribute('disabled', 'false');
    }
    else{
      document.getElementById('Start_Date').removeAttribute('disabled');
      document.getElementById('End_Date').removeAttribute('disabled');
    }    
  }
}
