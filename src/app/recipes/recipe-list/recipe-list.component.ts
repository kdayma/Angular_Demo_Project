import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy{
  @Output() selectedRecipeItem = new EventEmitter<Recipe>();
  subscription:Subscription;
  recipes:Recipe[];
  constructor(private recipeService:RecipeService, private router:Router, private route:ActivatedRoute){
  }
  ngOnInit(): void {
    this.subscription = this.recipeService.recipeChanged.subscribe(
      (recipes)=>{
        this.recipes = recipes;
      }
    );
    this.recipes = this.recipeService.getRecipes();
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
