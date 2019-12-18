import { Injectable } from '@angular/core';
import { ITask } from './task';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';


@Injectable({
    providedIn:'root'
})
export class TaskService{
    private taskURL='http://localhost/webapi/api/task';
    private updateTaskURL='http://localhost/webapi/api/UpdateTask';
    private completeTaskURL='http://localhost/webapi/api/CompleteTask';
    private singleTaskURL='';    

    constructor(private http:HttpClient){}

    getTasks():Observable<ITask[]>{
        return this.http.get<ITask[]>(this.taskURL).pipe(
            tap(data=> console.log('All: '+JSON.stringify(data))),
            catchError(this.handleError)
        );
    }


    getTaskDetail(id:number): Observable<ITask | undefined>{
        this.singleTaskURL=this.taskURL+"/"+id;
        return this.http.get<ITask>(this.singleTaskURL).pipe(
            tap(data=> console.log('Single Task details: '+JSON.stringify(data),'Task URI: '+ JSON.stringify(this.singleTaskURL))),
            catchError(this.handleError),            
        );        
    }

    createTask(task: ITask) {
        return this.http.post(this.taskURL, task);
    }

    updateTask(id:number,task: ITask) {  
        this.singleTaskURL=this.taskURL+"/"+id;      
        return this.http.post(this.singleTaskURL, task);
    }

    completeTask(task: ITask){        
        return this.http.post(this.completeTaskURL, task);
    }


    handleError(err:HttpErrorResponse){
        let errorMessage='';
        if(err.error instanceof ErrorEvent){
            //client error
            errorMessage=`An error occured: ${err.error.message}`;
        }else{
            //server error
            errorMessage=`Server returned code: ${err.status}, with error message: ${err.message}`;
        }
        console.error(errorMessage);
        return throwError(errorMessage);
    }

}