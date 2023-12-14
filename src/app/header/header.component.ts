import {Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription, map } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromApp from "../store/app.reducer";
import { logOut } from '../auth/store/auth.actions';
import { fetchRecipe, storeRecipe } from '../recipes/store/recipes.actions';
@Component({
    selector:'app-header',
    templateUrl:'./header.component.html',
})
export class HeaderComponent implements OnInit,OnDestroy {
    isAuthenticated = false;
    collapsed = true;
    authSubscription:Subscription;
    constructor(private store:Store<fromApp.AppState>){}

    ngOnInit(): void {
        this.authSubscription = this.store.select('auth').pipe(map((authState)=> authState.user)).subscribe(
            user =>{
                this.isAuthenticated =  !!user
            }
        );
    }
    onSaveData(){
        this.store.dispatch(storeRecipe());
    }
    onLogOut(){
        this.store.dispatch(logOut());
    }
    onFetchData(){
        this.store.dispatch(fetchRecipe());
    }

    ngOnDestroy(): void {
        this.authSubscription.unsubscribe();
    }
}