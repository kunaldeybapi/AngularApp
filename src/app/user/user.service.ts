import { Injectable, RootRenderer } from '@angular/core';
import { IUser } from './user'

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
    providedIn:'root'
})

export class UserService{
    private addUserURL='http://localhost/webapi/api/User';    
    private removeUserURL='http://localhost/webapi/api/RemoveUser';
    private singleUserURL='';

    constructor(private http:HttpClient){}

    getUsers():Observable<IUser[]>{
        return this.http.get<IUser[]>(this.addUserURL).pipe(
            tap(data=> console.log('All User data: '+JSON.stringify(data))),
            catchError(this.handleError)
        );
    }    

    getUserDetail(id:number): Observable<IUser | undefined>{
        this.singleUserURL=this.addUserURL+"/"+id;       
        return this.http.get<IUser>(this.singleUserURL).pipe(
            tap(data=> console.log('Single User details: '+JSON.stringify(data),'User URI: '+ JSON.stringify(this.singleUserURL))),
            catchError(this.handleError),            
        );        
    }

    createUser(user: IUser) {        
        return this.http.post(this.addUserURL, user);
    }

    updateUser(id:number,user: IUser) {  
        this.singleUserURL=this.addUserURL+"/"+id;      
        return this.http.post(this.singleUserURL, user);
    }

    deleteUser(user: IUser){        
        return this.http.post(this.removeUserURL, user);
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
