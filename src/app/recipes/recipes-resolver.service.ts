import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Recipe } from "./recipe.model";
import { Observable, map, of, switchMap, take } from "rxjs";
import * as fromApp from 'src/app/store/app.reducer';
import { Store } from "@ngrx/store";
import { SET_RECIPES, fetchRecipe } from "./store/recipes.actions";
import { Actions, ofType } from "@ngrx/effects";

@Injectable({providedIn:'root'})
export class RecipeResolverService implements Resolve<Recipe[]>{
    constructor(private store:Store<fromApp.AppState>,
        private action$:Actions){}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
        return this.store.select('recipes').pipe(
            take(1),
            map(recipeState =>{
                return recipeState.recipes
            }),
            switchMap(
                recipes => {
                    if(recipes.length === 0){
                        this.store.dispatch(fetchRecipe());
                        return this.action$.pipe(ofType(SET_RECIPES),take(1));
                    }
                    else{
                        return of(recipes);
                    }
                }
            )
        )
    }
}