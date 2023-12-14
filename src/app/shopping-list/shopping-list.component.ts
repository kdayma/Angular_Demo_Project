import { Component,OnDestroy,OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingredient.module';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { startedEditing } from './shopping-list.actions';

import * as formApp from 'src/app/store/app.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit{
  ingredients: Observable<{ingredients:Ingredient[]}>;
  constructor(private store:Store<formApp.AppState>){}

  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList');
  }


  onEditItem(index:number){
    this.store.dispatch(startedEditing({index:index}));
  }
}
