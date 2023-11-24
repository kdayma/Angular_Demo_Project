import {Injectable } from "@angular/core";
import { Recipe } from "./recipe.model";
import { Ingredient } from "../shared/ingredient.module";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Subject } from "rxjs";


@Injectable({providedIn:'root'})
export class RecipeService {
    recipeChanged =  new Subject <Recipe[]>();
    constructor(private shoppingListServive:ShoppingListService){}
    private recipes:Recipe[] = [];
    setRecipes(fetchedRecipes:Recipe[]){
        this.recipes = fetchedRecipes;
        this.recipeChanged.next(this.recipes.slice());
    }
    getRecipes(){
        return this.recipes.slice();
    }

    getRecipeFromId(id:number){
        return this.recipes.at(id);
    }

    addRecipe(recipe:Recipe){
        this.recipes.push(recipe);
        this.recipeChanged.next(this.recipes.slice());
    }

    updateRecipe(id:number,updatedRecipe:Recipe){
        this.recipes[id] = updatedRecipe;
        this.recipeChanged.next(this.recipes.slice());
    }

    removeRecipe(id:number){
        this.recipes.splice(id,1);
        this.recipeChanged.next(this.recipes.slice());
    }

    addIngredientToShoppingList(ingredients:Ingredient[]){
        this.shoppingListServive.addIngredientsInList(ingredients);
    }
}
