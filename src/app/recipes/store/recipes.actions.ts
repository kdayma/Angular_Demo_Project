import { createAction, props } from "@ngrx/store";
import { Recipe } from "../recipe.model";

export const SET_RECIPES = '[Recipes] Set Recipe';
export const FETCH_RECIPES = '[Recipes] Fetch Recipe';
export const ADD_RECIPE = '[Recipes] Add Recipe';
export const UPDATE_RECIPE = '[Recipes] Update Recipe';
export const REMOVE_RECIPE = '[Recipes] Remove Recipe';
export const STORE_RECIPE = '[Recipes] Store Recipe';

export const setRecipes = createAction(
    SET_RECIPES,
    props<{payload:Recipe[]}>()
)

export const addRecipe = createAction(
    ADD_RECIPE,
    props<{payload:Recipe}>()
)

export const updateRecipe = createAction(
    UPDATE_RECIPE,
    props<{payload:{id:number,updatedRecipe:Recipe}}>()
)

export const removeRecipe = createAction(
    REMOVE_RECIPE,
    props<{payload:number}>()
)

export const fetchRecipe = createAction(
    FETCH_RECIPES
)

export const storeRecipe = createAction(
    STORE_RECIPE
)