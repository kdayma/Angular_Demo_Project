import { Component,OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Recipe } from '../recipe.model';
import * as fromApp from "src/app/store/app.reducer";
import { map } from 'rxjs';
import { removeRecipe } from '../store/recipes.actions';
import { addIngredients } from 'src/app/shopping-list/shopping-list.actions';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css']
})
export class RecipeDetailsComponent implements OnInit{
  recipe:Recipe;
  id:number;

  constructor(
    private store:Store<fromApp.AppState>,
    private route:ActivatedRoute, 
    private router:Router){
  }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params:Params) => {
        this.id = +params['id']
        this.store.select('recipes').pipe(
          map((recipeState)=>{
            return recipeState.recipes.find((recipe,index)=>{
              return index === this.id;
            })
          })
        ).subscribe(
          (recipe) =>{
            this.recipe = recipe;
          }
        )
      }
    )
  }

  onAddToShoppingList(){
    this.store.dispatch(addIngredients({ingredients:this.recipe.ingredients}));
  }
  onGoToEditRecipe(){
    this.router.navigate(['edit'],{relativeTo:this.route});
  }
  onDeleteRecipe(){
    this.router.navigate(['../..'],{relativeTo:this.route});
    // this.recipeService.removeRecipe(this.id);
    this.store.dispatch(removeRecipe({payload:this.id}));
  }
}
