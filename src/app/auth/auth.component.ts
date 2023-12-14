import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceholderDirective } from "../shared/placeholder/placeholder.directive";
import { Store } from "@ngrx/store";
import * as  fromApp from "../store/app.reducer"
import { errorClear, loginStart, signUpStart } from "./store/auth.actions";

@Component({
    selector:'auth',
    templateUrl:'./auth.component.html'
})
export class AuthenticationComponent implements OnInit, OnDestroy {
    isLoginMode:boolean = true;
    isLoading = false;
    error:string=null;
    @ViewChild(PlaceholderDirective) hostRef:PlaceholderDirective;
    private closeSubscription:Subscription;
    private storeSubscription:Subscription;

    constructor(private componentFactoryResolver:ComponentFactoryResolver,private store:Store<fromApp.AppState>){}

    ngOnInit(): void {
        this.storeSubscription = this.store.select('auth').subscribe(authState =>{
            this.isLoading = authState.loading;
            this.error = authState.authError;
            if (this.error){
                this.onShowAlertComponent(this.error);
            }
        })
    }
    onSwitchMode(){
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(authForm:NgForm){
        if(!authForm.valid){
            return;
        }
        this.isLoading = true;
        const email = authForm.value.email;
        const password = authForm.value.password;
        if(this.isLoginMode){
            this.store.dispatch(loginStart({payload:{email:email,password:password}}));
        }
        else{
            this.store.dispatch(signUpStart({payload:{email:email,password:password}}));
        }
        authForm.reset();
    }
    onHandleError(){
        this.store.dispatch(errorClear());
    }
    private onShowAlertComponent(errorMessage:string){
        const alertCmpFac = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
        const hostCmpRef = this.hostRef.viewContainerRef;
        hostCmpRef.clear();
        const cmpRef = hostCmpRef.createComponent(alertCmpFac);
        cmpRef.instance.message = errorMessage;
        this.closeSubscription = cmpRef.instance.closeEvent.subscribe(()=>{
            this.closeSubscription.unsubscribe();
            hostCmpRef.clear();
        });
    }

    ngOnDestroy(): void {
        if (this.closeSubscription)
            this.closeSubscription.unsubscribe();
        if(this.storeSubscription)
            this.storeSubscription.unsubscribe();
    }
}