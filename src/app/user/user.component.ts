import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from './user.service'
import { IUser } from './user';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {  
  errorMessage:string='';
  addUserForm:FormGroup;
  filterUsers:IUser[];
  users:IUser[]=[];
  
  constructor(private router: Router, private userService: UserService, private route: ActivatedRoute,private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.userService.getUsers().subscribe({
      next: users=>{
          this.users=users;
          this.filterUsers=this.users;
      },
      error: err=>(this.errorMessage=err)
  });

    this.addUserForm = this.formBuilder.group({            
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      Employee_ID: ['',Validators.required]
    });
  }

  private _userNameFilter : string;
  public get userNameFilter() : string {
    return this._userNameFilter;
  }
  public set userNameFilter(v : string) {
    this._userNameFilter = v;
    this.filterUsers=this._userNameFilter?this.performUserNameFilter(this._userNameFilter):this.users;
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
        //this.router.navigate(['/user']);
        window.location.reload();
      });
    }    
  }

  performUserNameFilter(filterBy: string): IUser[] {
    filterBy=filterBy.toLocaleLowerCase();
    return this.users.filter((users: IUser) => users.FirstName.toLocaleLowerCase().indexOf(filterBy)!== -1);
  }

  editUser(userID: number){
    this.userService.getUserDetail(userID).subscribe(
      data => {
        this.addUserForm.setValue(data);
    });
}

  onReset():void{
    this.addUserForm.reset({FirstName:'',LastName:'',Employee_ID:''});
  }

}