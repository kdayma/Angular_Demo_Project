import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipes.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css']
})
export class RecipeDetailsComponent implements OnInit{
  recipe:Recipe;
  id:number;

  constructor(private recipeService:RecipeService, private route:ActivatedRoute, private router:Router){
  }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params:Params) => {
        this.id = +params['id']
        this.recipe =  this.recipeService.getRecipeFromId(this.id);
      }
    )
  }

  onAddToShoppingList(){
    this.recipeService.addIngredientToShoppingList(this.recipe.ingredients);
  }
  onGoToEditRecipe(){
    this.router.navigate(['edit'],{relativeTo:this.route});
  }
  onDeleteRecipe(){
    this.router.navigate(['../..'],{relativeTo:this.route});
    this.recipeService.removeRecipe(this.id);
  }
}
