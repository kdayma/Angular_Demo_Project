import { Component,OnDestroy,OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingredient.module';
import { ShoppingListService } from './shopping-list.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit, OnDestroy{
  ingredients: Ingredient[];
  igChangeSubscription:Subscription;
  constructor(private shoppingListService:ShoppingListService){}

  ngOnInit(): void {
    this.ingredients = this.shoppingListService.getIngredients();
    this.igChangeSubscription = this.shoppingListService.ingredientsChanged.subscribe(
      (ingredientsOfArray:Ingredient[]) =>{
        this.ingredients = ingredientsOfArray;
      }
    );
  }

  ngOnDestroy(): void {
    this.igChangeSubscription.unsubscribe();
  }

  onEditItem(index:number){
    this.shoppingListService.startedEditing.next(index);
  }
}
