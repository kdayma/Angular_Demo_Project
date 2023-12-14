import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Recipe } from '../recipe.model';
import * as fromApp from 'src/app/store/app.reducer'

import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, map } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy{
  @Output() selectedRecipeItem = new EventEmitter<Recipe>();
  subscription:Subscription;
  recipes:Recipe[];
  constructor(private router:Router, 
    private route:ActivatedRoute,
    private store:Store<fromApp.AppState>){
  }
  ngOnInit(): void {
    this.subscription = this.store.select('recipes').
    pipe(
      map(
        (recipeState) =>{
          return recipeState.recipes
        }
      )
    ).
    subscribe(
      (recipes)=>{
        this.recipes = recipes;
      }
    );
  }
  selectedItem(item:Recipe){
    this.selectedRecipeItem.emit(item);
  }
  onNewRecipe(){
    this.router.navigate(['new'],{relativeTo:this.route});
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
