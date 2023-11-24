import { Component, ComponentFactoryResolver, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthResponse, AuthenticationService } from "./auth.service";
import { Observable, Subscription } from "rxjs";
import { Router } from "@angular/router";
import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceholderDirective } from "../shared/placeholder/placeholder.directive";

@Component({
    selector:'auth',
    templateUrl:'./auth.component.html'
})
export class AuthenticationComponent {
    isLoginMode:boolean = true;
    isLoading = false;
    error:string=null;
    @ViewChild(PlaceholderDirective) hostRef:PlaceholderDirective;
    closeSubscription:Subscription;
    constructor(private authService:AuthenticationService, private router:Router, private componentFactoryResolver:ComponentFactoryResolver){}

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
        let authObs : Observable<AuthResponse>;
        if(this.isLoginMode){
            //...
            authObs = this.authService.logIn(email,password);
        }
        else{
            authObs = this.authService.signUp(email,password);
        }
        authObs.subscribe(
            (authResponse) =>{
                this.isLoading = false;
                this.router.navigate(['./recipes']);
            },
            errorMessage =>{
                this.isLoading = false;
                this.error = errorMessage;
                this.onShowAlertComponent(this.error);

            }
        )
        authForm.reset();
    }
    // onHandleError(){
    //     this.error = null;
    // }
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
}