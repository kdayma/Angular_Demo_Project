import { Injectable } from "@angular/core";
import * as fromAuthState from "./store/auth.reducer"; 
import { Store } from "@ngrx/store";
import {logOut } from "./store/auth.actions";

@Injectable({providedIn:'root'})
export class AuthenticationService{
    timerExpirationPeriod = null;
    constructor(private store:Store<fromAuthState.State>){}

    setTimerLogout(expireDuration: number){
        this.timerExpirationPeriod = setTimeout(
            () =>{
                this.store.dispatch(logOut());
            }
            ,expireDuration);
    }

    clearTimerLogout(){
        if (this.timerExpirationPeriod){
            clearTimeout(this.timerExpirationPeriod);
            this.timerExpirationPeriod = null;
        }
    }
}