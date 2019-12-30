import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from './project.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';



@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  currentDate:string;
  date:Date;
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
    const startDate=this.addProjectForm.get('Start_Date').value;
    const endDate=this.addProjectForm.get('End_Date').value;

    if(projectName== ""){
      alert('Please fill in all the mandatory field(s): Project to add a new project!');
    }
    else if(startDate>endDate){
      alert('End date cannot be before Start date!');
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
      this.addProjectForm.get('Start_Date').disable();
      this.addProjectForm.get('End_Date').disable();
      this.addProjectForm.controls['Start_Date'].setValue('');
      this.addProjectForm.controls['End_Date'].setValue('');
    }
    else{
      this.currentDate=formatDate(new Date(),'yyyy-MM-dd','en');
      this.addProjectForm.get('Start_Date').enable();
      this.addProjectForm.controls['Start_Date'].patchValue(this.currentDate);
      
      this.date=new Date();
      this.date.setDate(this.date.getDate()+1);      
      this.currentDate=formatDate(this.date,'yyyy-MM-dd','en');      
      this.addProjectForm.get('End_Date').enable();
      this.addProjectForm.controls['End_Date'].patchValue(this.currentDate);
    }    
  }

  Reset():void{
    window.location.reload();
  }
}
