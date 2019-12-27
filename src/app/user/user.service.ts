import { Injectable, RootRenderer } from '@angular/core';
import { IUser } from './user'

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
    providedIn:'root'
})

export class UserService{
    private addUserURL='http://localhost/webapi/api/AddUser';

    constructor(private http:HttpClient){}

    createUser(user: IUser) {        
        return this.http.post(this.addUserURL, user);
    }
}
