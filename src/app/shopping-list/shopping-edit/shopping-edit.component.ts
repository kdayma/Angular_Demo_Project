import { Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.module';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { addIngredient, removeIngredient, stopEditing, updateIngredient } from '../shopping-list.actions';
import * as fromApp from 'src/app/store/app.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy{
  subscription:Subscription;
  editMode=false;
  editedItem:Ingredient;
  @ViewChild('f') shoppingListForm:NgForm;
  constructor(private store:Store<fromApp.AppState>){
  }
  ngOnInit(): void {
    this.subscription = this.store.select('shoppingList').subscribe(
      (stateData) =>{
        if (stateData.editedItemIndex > -1){
          this.editMode = true;
          this.editedItem = stateData.editedItemIngredient;
          this.shoppingListForm.setValue({
            'name':this.editedItem.name,
            'amount':this.editedItem.amount
          });
        } else {
          this.editMode = false;
        }

      }
    )
  }

  onSubmit(form:NgForm){
    const name = form.value.name;
    const amount = form.value.amount;
    if (this.editMode) {
      this.store.dispatch(updateIngredient({ingredient:new Ingredient(name,amount)}));
    }
    else{
      this.store.dispatch(addIngredient({ingredient:new Ingredient(name,amount)}));
    }
    this.editMode = false;
    form.reset();
  }
  onClear(){
    this.shoppingListForm.reset();
    this.editMode = false;
    this.store.dispatch(stopEditing());
  }
  onDelete(){
    this.store.dispatch(removeIngredient());
    this.onClear();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.store.dispatch(stopEditing());
  }
}
