import { createAction, props } from "@ngrx/store";

export const LOGIN_START = '[Auth] Login Start';
export const AUTHENTICATE_SUCCESS = '[Auth] Authenticate Success';
export const AUTHENTICATE_FAILURE = '[Auth] Authenticate Failure';
export const LOGOUT = '[Auth] Logout';
export const SIGN_UP_START = '[Auth] Sign Up Start';
export const ERROR_CLEAR = '[Auth] Error Clear';
export const AUTO_LOGIN = '[Auth] Auto Login';

export const authenticateSuccess = createAction(
    AUTHENTICATE_SUCCESS,
    props<{payload:{email:string; 
        userId:string; 
        token:string; 
        tokenExpirationDate:Date;
        redirect:boolean}}>()
)

export const logOut = createAction(
    LOGOUT
)

export const loginStart = createAction(
    LOGIN_START,
    props<{payload:{email:string;password:string}}>()
)

export const authenticateFailure = createAction(
    AUTHENTICATE_FAILURE,
    props<{payload:string}>()
)

export const signUpStart = createAction(
    SIGN_UP_START,
    props<{payload:{email:string;password:string}}>()
)

export const errorClear = createAction(
    ERROR_CLEAR
)

export const autoLogin = createAction(
    AUTO_LOGIN
)