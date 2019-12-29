import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaskComponent } from 'src/app/task/task-list.component';
import { TaskDetailsComponent } from './task/task-details.component';
import { RouterModule } from '@angular/router';
import { TaskDetailsGuard } from './task/task-details.guard';
import { AddTaskComponent } from './task/add-task.component';
import { UserComponent } from './user/user.component';
import { ProjectComponent } from './project/project.component';


@NgModule({
  declarations: [
    AppComponent,
    TaskComponent,
    TaskDetailsComponent,    
    AddTaskComponent, UserComponent, ProjectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      {path:'addTask',component:AddTaskComponent},           
      {path:'tasks',component:TaskComponent},
      {
        path:'tasks/:id',
        canActivate: [TaskDetailsGuard],
        component: TaskDetailsComponent
      },
      {path:'user',component:UserComponent},      
      {path:'',redirectTo:'tasks',pathMatch:'full'},
      {path:'**',redirectTo:'tasks',pathMatch:'full'}
    ],{useHash: true})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
