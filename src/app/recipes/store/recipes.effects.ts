import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { FETCH_RECIPES, STORE_RECIPE, setRecipes } from "./recipes.actions";
import { Recipe } from "../recipe.model";
import * as fromApp from "src/app/store/app.reducer";

import { map, switchMap, withLatestFrom } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Store } from "@ngrx/store";

@Injectable()
export class RecipeEffects {
    fetchRecipe = createEffect(
        () => this.action$.pipe(
            ofType(FETCH_RECIPES),
            switchMap(
                () =>{
                    return this.http.get<Recipe[]>('https://angular-recipe-project-b559c-default-rtdb.firebaseio.com/recipes.json')
                }
            ),
            map(
                recipes =>{
                    return recipes.map(
                        recipe =>{
                            return {...recipe,ingredients:recipe.ingredients?recipe.ingredients : []};
                        }
                    )
                }
            ),
            map(recipes =>{
                return setRecipes({payload:recipes});
            })
        )
    )

    storeRecipe = createEffect(
        () => this.action$.pipe(
            ofType(STORE_RECIPE),
            withLatestFrom(this.store.select('recipes')),
            switchMap(([actionData,recipesState]) =>{
                return this.http.put('https://angular-recipe-project-b559c-default-rtdb.firebaseio.com/recipes.json',recipesState.recipes);
            })
        ),
        {dispatch:false}
    )
    constructor (private action$:Actions, private http:HttpClient, private store:Store<fromApp.AppState>){}
}