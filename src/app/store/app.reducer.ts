import * as fromShoppingList from'src/app/shopping-list/shopping-list.reducer';
import * as fromAuth from'src/app/auth/store/auth.reducer';
import * as fromRecipes from'src/app/recipes/store/recipes.reducer';
import { ActionReducerMap } from '@ngrx/store';

export interface AppState{
    shoppingList : fromShoppingList.State;
    auth: fromAuth.State;
    recipes:fromRecipes.State
}

export const authReducer:ActionReducerMap<AppState> = {
    shoppingList:fromShoppingList.shoppingListReducer,
    auth:fromAuth.authReducer,
    recipes:fromRecipes.recipeReducer
}