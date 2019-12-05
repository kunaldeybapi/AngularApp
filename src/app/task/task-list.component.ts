import { Component, OnInit, SystemJsNgModuleLoader } from '@angular/core';
import {ITask} from './task' 

import { TaskService } from './task.service';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
    selector:'tm-viewtask',
    templateUrl:'./task-list.component.html',
    styleUrls:['./task-list.component.css']
})

export class TaskComponent implements OnInit{        
    filterTasks:ITask[];
    tasks:ITask[]=[];
    errorMessage:string='';

    private _taskFilter : string;

    constructor(private route: ActivatedRoute, private taskService:TaskService, private router:Router){        
        this._taskFilter='';        
    }

    ngOnInit(): void {        
        this.taskService.getTasks().subscribe({
            next: tasks=>{
                this.tasks=tasks;
                this.filterTasks=this.tasks;
            },
            error: err=>(this.errorMessage=err)
        });        
    }

    
    private _startDateFilter : string;
    public get startDateFilter() : string {
        return this._startDateFilter;
    }
    public set startDateFilter(v : string) {
        this._startDateFilter = v;
        this.filterTasks=this._startDateFilter?this.performStartDateFilter(this._startDateFilter):this.tasks;
    }

    
    private _endDateFilter : string;
    public get endDateFilter() : string {
        return this._endDateFilter;
    }
    public set endDateFilter(v : string) {
        this._endDateFilter = v;
        this.filterTasks=this._endDateFilter?this.performEndDateFilter(this._endDateFilter):this.tasks;
    }

    public get taskFilter() : string {
        return this._taskFilter;
    }
    public set taskFilter(v : string) {
        this._taskFilter = v;
        this.filterTasks=this._taskFilter?this.performTaskFilter(this._taskFilter):this.tasks;
    }
    
    private _parentTaskFilter : string;
    public get parentTaskFilter() : string {
        return this._parentTaskFilter;
    }
    public set parentTaskFilter(v : string) {
        this._parentTaskFilter = v;
        this.filterTasks=this._parentTaskFilter?this.performParentTaskFilter(this._parentTaskFilter):this.tasks;
    }

    
    private _priorityFromFilter : number;
    public get priorityFromFilter() : number {
        return this._priorityFromFilter;
    }
    public set priorityFromFilter(v : number) {
        this._priorityFromFilter = v;
        this.filterTasks=this._priorityFromFilter?this.performPriorityFromFiler(this._priorityFromFilter):this.tasks;
    }
    
    private _priorityToFilter : number;
    public get priorityToFilter() : number {
        return this._priorityToFilter;
    }
    public set priorityToFilter(v : number) {
        this._priorityToFilter = v;
        this.filterTasks=this._priorityToFilter?this.performPriorityToFilter(this._priorityToFilter):this.tasks;
    }       

    performTaskFilter(filterBy: string): ITask[] {
        filterBy=filterBy.toLocaleLowerCase();
        return this.tasks.filter((tasks: ITask) => tasks.task.toLocaleLowerCase().indexOf(filterBy)!== -1);
    }

    performParentTaskFilter(filterBy: string): ITask[] {
        filterBy=filterBy.toLocaleLowerCase();
        return this.tasks.filter((tasks: ITask) => tasks.parentTask.toLocaleLowerCase().indexOf(filterBy)!== -1);
    }

    performPriorityFromFiler(filterBy: number): ITask[] {        
        return this.tasks.filter((tasks:ITask)=> tasks.priority >= filterBy)
    }

    performPriorityToFilter(filterBy: number): ITask[]{
        return this.tasks.filter((tasks:ITask)=> tasks.priority <= filterBy)

    }

    performStartDateFilter(filterBy: string): ITask[] {        
        return this.tasks.filter((tasks: ITask) => tasks.startDate >= filterBy);
    }

    performEndDateFilter(filterBy: string): ITask[] {
        return this.tasks.filter((tasks: ITask) => tasks.endDate >= filterBy);
    }

    editTask(task: ITask): void {
        localStorage.removeItem("editTaskId");
        localStorage.setItem("editTaskId", task.taskID.toString());
        this.router.navigate(['/tasks',task.taskID]);
    }

    endTask(task: ITask){           
        return this.taskService.completeTask(task).pipe().subscribe(
            data => {
                window.location.reload();
              },
              error => {
                alert(error);
              }
        );
    }    
}