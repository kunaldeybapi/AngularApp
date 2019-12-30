import { Injectable, RootRenderer } from '@angular/core';
import { IProject } from './project'

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
    providedIn:'root'
})

export class ProjectService{
    private addProjectURL='http://localhost/webapi/api/projects';
    private updateProjectURL='http://localhost/webapi/api/UpdateProject';      
    private removeProjectURL='http://localhost/webapi/api/RemoveProject';
    private singleProjectURL='';

    constructor(private http:HttpClient){}

    getProjects():Observable<IProject[]>{
        return this.http.get<IProject[]>(this.addProjectURL).pipe(
            tap(data=> console.log('All Project data: '+JSON.stringify(data))),
            catchError(this.handleError)
        );
    }    

    getProjectDetail(id:number): Observable<IProject | undefined>{
        this.singleProjectURL=this.addProjectURL+"/"+id;       
        return this.http.get<IProject>(this.singleProjectURL).pipe(
            tap(data=> console.log('Single Project details: '+JSON.stringify(data),'Project URI: '+ JSON.stringify(this.singleProjectURL))),
            catchError(this.handleError),            
        );        
    }

    createProject(project: IProject) {        
        return this.http.post(this.addProjectURL, project);
    }

    updateProject(id:number,project: IProject) {  
        this.singleProjectURL=this.updateProjectURL+"/"+id;      
        return this.http.post(this.singleProjectURL, project);
    }

    completeProject(project: IProject){        
        return this.http.post(this.removeProjectURL, project);
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
