import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.module";
import { Injectable } from "@angular/core";

@Injectable({providedIn:'root'})
export class ShoppingListService {
    ingredientsChanged =  new Subject<Ingredient[]>();
    startedEditing = new Subject<number>();
    private ingredients:Ingredient[] = [];
    getIngredients(){
        return this.ingredients.slice();
    }
    getIngredient(index){
        return this.ingredients.at(index);
    }
    addIngredients(ingredient:Ingredient){
        this.ingredients.push(ingredient);
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    addIngredientsInList(ingredients:Ingredient[]){
        for (let item of ingredients){
            const check = this.ingredients.some(e => e.name === item.name);
            if (check == false) {
                this.ingredients.push(item);
            }
        }
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    updateIngredients(index:number,newIngredient:Ingredient){
        this.ingredients[index]=newIngredient;
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    removeIngredient(index:number){
        this.ingredients.splice(index,1);
        this.ingredientsChanged.next(this.ingredients.slice());
    }
}