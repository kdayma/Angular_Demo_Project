import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RecipeService } from "../recipes/recipes.service";
import { Recipe } from "../recipes/recipe.model";
import { map,tap} from "rxjs/operators";
import { AuthenticationService } from "../auth/auth.service";

@Injectable({providedIn:'root'})
export class DataStorageService{
    constructor(private http:HttpClient, private recipeService:RecipeService, private authService:AuthenticationService){}
    
    saveRecipeData(){
        const recipes = this.recipeService.getRecipes();
        this.http.put('https://angular-recipe-project-b559c-default-rtdb.firebaseio.com/recipes.json',recipes,).subscribe(
            (responseData)=>{
                console.log(responseData);
            }
        )
    }

    fetchRecipeData(){
        return this.http.get<Recipe[]>('https://angular-recipe-project-b559c-default-rtdb.firebaseio.com/recipes.json')
        .pipe(
            map(
                recipes =>{
                    return recipes.map(
                        recipe =>{
                            return {...recipe,ingredients:recipe.ingredients?recipe.ingredients : []};
                        }
                    )
                }
            ),
            tap(
                (recipes) =>{
                    this.recipeService.setRecipes(recipes);
                }
            )
        )
    }
}