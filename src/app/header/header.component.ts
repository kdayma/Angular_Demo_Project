import {Component, OnDestroy, OnInit} from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthenticationService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
@Component({
    selector:'app-header',
    templateUrl:'./header.component.html',
})
export class HeaderComponent implements OnInit,OnDestroy {
    isAuthenticated = false;
    collapsed = true;
    authSubscription:Subscription;
    constructor(private dataService:DataStorageService, private authService:AuthenticationService){}

    ngOnInit(): void {
        this.authSubscription = this.authService.userAuthenticated.subscribe(
            user =>{
                this.isAuthenticated =  !!user
            }
        );
    }
    onSaveData(){
        this.dataService.saveRecipeData();
    }
    onLogOut(){
        this.authService.logOut();
    }
    onFetchData(){
        this.dataService.fetchRecipeData().subscribe();
    }

    ngOnDestroy(): void {
        this.authSubscription.unsubscribe();
    }
}