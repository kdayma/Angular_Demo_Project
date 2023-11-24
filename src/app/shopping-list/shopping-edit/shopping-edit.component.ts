import { Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { ShoppingListService } from '../shopping-list.service';
import { Ingredient } from 'src/app/shared/ingredient.module';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy{
  subscription:Subscription;
  editMode=false;
  editedItem:Ingredient;
  editedItemIndex:number;
  @ViewChild('f') shoppingListForm:NgForm;
  constructor(private shoppingListService:ShoppingListService){
  }
  ngOnInit(): void {
    this.subscription = this.shoppingListService.startedEditing.subscribe(
      (index) =>{
        this.editMode = true;
        this.editedItemIndex = index;
          this.editedItem = this.shoppingListService.getIngredient(this.editedItemIndex);
          this.shoppingListForm.setValue({
            'name':this.editedItem.name,
            'amount':this.editedItem.amount
          });
      }
    )
  }

  onSubmit(form:NgForm){
    const name = form.value.name;
    const amount = form.value.amount;
    if (this.editMode) {
      this.shoppingListService.updateIngredients(this.editedItemIndex,new Ingredient(name,amount));
    }
    else{
      this.shoppingListService.addIngredients(new Ingredient(name,amount));
    }
    this.editMode = false;
    form.reset();
  }
  onClear(){
    this.shoppingListForm.reset();
    this.editMode = false;
  }
  onDelete(){
    this.shoppingListService.removeIngredient(this.editedItemIndex);
    this.onClear();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
