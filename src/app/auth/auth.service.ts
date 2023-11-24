import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject,catchError, tap, throwError } from "rxjs";
import { User } from "./user.model";
import { Router } from "@angular/router";

export interface AuthResponse{
    idToken:string,
    email:string,
    refreshToken:string,
    expiresIn:string,
    localId:string,
    registered?:boolean
}
@Injectable({providedIn:'root'})
export class AuthenticationService{
    userAuthenticated = new BehaviorSubject<User>(null);
    timerExpirationPeriod = null;
    constructor(private http:HttpClient, private router:Router){}

    signUp(email:string,password:string){
        return this.http.post<AuthResponse>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBfYlyIspgq7XluzUfMe2Yfx0QlpDNBzOo',{
            email:email,
            password:password,
            returnSecureToken:true
        }).pipe(catchError(this.handleErrorResponse),tap(
            respData =>{
                this.handleAuthentication(respData.email,respData.localId,respData.idToken,+respData.expiresIn);
            }
        ));
    }

    logIn(email:string,password:string){
        return this.http.post<AuthResponse>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBfYlyIspgq7XluzUfMe2Yfx0QlpDNBzOo',{
            email:email,
            password:password,
            returnSecureToken:true  
        }).pipe(catchError(this.handleErrorResponse),tap(
            respData =>{
                this.handleAuthentication(respData.email,respData.localId,respData.idToken,+respData.expiresIn);
            }
        ));
    }

    onAutoLogin(){
        const userData:{
            email:string,
            userId:string,
            _token:string,
            _tokenExpirationDate:string
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData){
            return;
        }
         const loadedUser = new User(userData.email,userData.userId,userData._token,new Date(userData._tokenExpirationDate));
         if(loadedUser.token){
            this.userAuthenticated.next(loadedUser);
            const expireTime = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.onAutoLogOut(expireTime);
         }
    }

    logOut(){
        this.userAuthenticated.next(null);
        this.router.navigate(['./auth']);
        localStorage.removeItem('userData');
        if(this.timerExpirationPeriod){
            clearTimeout(this.timerExpirationPeriod);
        }
        this.timerExpirationPeriod = null;
    }

    
    onAutoLogOut(expireDuration: number){
        this.timerExpirationPeriod = setTimeout(
            () =>{
                this.logOut();
            }
            ,expireDuration);
    }

    private handleErrorResponse(errorRes:HttpErrorResponse){
        let errorMessage ="An unkown error Occured";
            if(!errorRes.error || !errorRes.error.error){
                throwError(errorMessage);
            }
            switch (errorRes.error.error.message){
                case 'EMAIL_EXISTS':
                    errorMessage = 'Email Id already exists user is already registered !!!';
                    break;
                case 'TOO_MANY_ATTEMPTS_TRY_LATER':
                    errorMessage = 'Too Many Login Attempts madhe please try after some time!!';
                    break;
                case 'INVALID_LOGIN_CREDENTIALS':
                    errorMessage = 'Entered credentials are invalid !!!';
                    break;
                default:
                    errorMessage = 'An error has occured..';
            }
            return throwError(errorMessage);
    }

    private handleAuthentication(email:string,userId:string,token:string,expiresIn:number){
        const expirationDate = new Date(new Date().getTime()+ expiresIn*1000);
        const user = new User(email,userId,token,expirationDate);
        this.userAuthenticated.next(user);
        this.onAutoLogOut(expiresIn * 1000);
        localStorage.setItem('userData',JSON.stringify(user));
    }
}