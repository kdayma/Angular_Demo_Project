import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AUTHENTICATE_SUCCESS, AUTO_LOGIN, LOGIN_START, LOGOUT, SIGN_UP_START,authenticateFailure, authenticateSuccess } from "./auth.actions";
import { catchError, map, of, switchMap, tap } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "../user.model";
import { AuthenticationService } from "../auth.service";
import { environment } from "src/environments/environment";

export interface AuthResponse{
    idToken:string,
    email:string,
    refreshToken:string,
    expiresIn:string,
    localId:string,
    registered?:boolean
}

const handleAuthentication = (email:string,localId:string,idToken:string, expiresIn:string) =>{
    const expirationDate = new Date(new Date().getTime()+ +expiresIn*1000);
    const user = new User(email,localId,idToken,expirationDate);
    localStorage.setItem('userData',JSON.stringify(user))
    return authenticateSuccess({payload:{
     email:email,
     userId:localId,
     token:idToken,
     tokenExpirationDate:expirationDate,
     redirect:true
    }})
}

const handleErrorMessage = (errorRes:any) =>{
    let errorMessage ="An unkown error Occured";
    if(!errorRes.error || !errorRes.error.error){
        return of(authenticateFailure({payload:errorMessage}));
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
    return of(authenticateFailure({payload:errorMessage}));
}

@Injectable()
export class AuthEffects{
    authLogIn = createEffect(
        () => this.action$.pipe(
            ofType(LOGIN_START),
            switchMap((authData:any) =>{
                return this.http.post<AuthResponse>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='+ environment.fireBaseApiKey,{
                    email:authData.payload.email,
                    password:authData.payload.password,
                    returnSecureToken:true  
                })
                .pipe(
                    tap((respData) =>{
                        this.authService.setTimerLogout(+respData.expiresIn * 1000);
                    }),
                    map(respData =>{
                        return handleAuthentication(respData.email,respData.localId,respData.idToken,respData.expiresIn);
                    }),
                    catchError(errorRes =>{
                        //...
                        return handleErrorMessage(errorRes);
                    })
                )
            })
        )
    );

    authRedirect = createEffect(
        () => this.action$.pipe(
            ofType(AUTHENTICATE_SUCCESS),
            tap((authenticateSuccess:any) =>{
                if (authenticateSuccess.payload.redirect){
                    this.router.navigate(['/']);
                }
            })
        ),
        {dispatch:false}
    )

    authLogOut = createEffect(
        () => this.action$.pipe(
            ofType(LOGOUT),
            tap(() =>{
                this.authService.clearTimerLogout();
                localStorage.removeItem('userData');
                this.router.navigate(['/auth']);
            })
        ),
        {dispatch:false}
    )

    autoLogin = createEffect(
       () => this.action$.pipe(
        ofType(AUTO_LOGIN),
        map(()=>{
            const userData:{
                email:string,
                userId:string,
                _token:string,
                _tokenExpirationDate:string
            } = JSON.parse(localStorage.getItem('userData'));
            if (!userData){
                return {type:'DUMMY'};
            }
             const loadedUser = new User(userData.email,userData.userId,userData._token,new Date(userData._tokenExpirationDate));
             if(loadedUser.token){
                const expireTime = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
                this.authService.setTimerLogout(expireTime);
                return authenticateSuccess({payload:{email:userData.email,userId:userData.userId,token:userData._token,tokenExpirationDate:new Date(userData._tokenExpirationDate),redirect:false}});
             }
             return {type:'DUMMY'};
        })
       ) 
    )

    signUpSuccess = createEffect(
        () => this.action$.pipe(
            ofType(SIGN_UP_START),
            switchMap((authData:any) =>{
                return this.http.post<AuthResponse>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='+ environment.fireBaseApiKey,{
                    email:authData.payload.email,
                    password:authData.payload.password,
                    returnSecureToken:true
                })
                .pipe(
                    tap((respData) =>{
                        this.authService.setTimerLogout(+respData.expiresIn * 1000);
                    }),
                    map(respData =>{
                        return handleAuthentication(respData.email,respData.localId,respData.idToken,respData.expiresIn);
                    }),
                    catchError(errorRes =>{
                        //...
                        return handleErrorMessage(errorRes);
                    })
                )
            })
        )
    );

    constructor(private action$:Actions,
        private http:HttpClient,
        private router:Router,
        private authService:AuthenticationService){}
}