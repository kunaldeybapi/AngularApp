import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskDetailsGuard implements CanActivate {
constructor(private route: Router){
}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let id=+next.url[1].path;
      if(isNaN(id) || id<1){
        alert("Invalid Task ID!!");
        this.route.navigate(['/tasks']);
        return false;
      };
    return true;
  }  
}
