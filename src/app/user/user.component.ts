import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from './user.service'


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  errorMessage:string='';
  addUserForm:FormGroup;

  constructor(private router: Router, private userService: UserService, private route: ActivatedRoute,private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.addUserForm = this.formBuilder.group({            
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      Employee_ID: ['',Validators.required]
    });
  }

  onSubmit():void {
    const firstName=this.addUserForm.get('FirstName').value;
    const lastName=this.addUserForm.get('LastName').value;    
    const employee_ID=this.addUserForm.get('Employee_ID').value;
    

    if(firstName== "" || lastName == "" || employee_ID == ""){
      alert('Please fill in all the mandatory details: First name, Last name & Employee ID to add a new user!');
    }
    else{
      this.userService.createUser(this.addUserForm.value)
      .subscribe( data => {
        this.router.navigate(['/user']);
      });
    }    
  }

  onReset():void{
    this.addUserForm.reset({FirstName:'',LastName:'',Employee_ID:''});
  }

}
