import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import {map, take } from "rxjs/operators";
import { Observable } from "rxjs";
import { AuthenticationService } from "./auth.service";
import { Injectable } from "@angular/core";

@Injectable({providedIn:'root'})
export class AuthGuard implements CanActivate{
    constructor(private authService:AuthenticationService,private router:Router){}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.authService.userAuthenticated.pipe(
            take(1),
            map(
                user =>{
                    const isAuth = !!user;
                    if(isAuth){
                        return true;
                    }
                    return this.router.createUrlTree(['/auth']);
                }
            )
        )
    }
}