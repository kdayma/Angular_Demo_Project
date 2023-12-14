import { createAction, props } from "@ngrx/store";
import { Ingredient } from "../shared/ingredient.module";

export const ADD_INGREDIENT = '[Shopping List] Add Ingredient';
export const ADD_INGREDIENTS = '[Shopping List] Add Ingredients';
export const REMOVE_INGREDIENT = '[Shopping List] Remove Ingredient';
export const UPDATE_INGREDIENT = '[Shopping List] Update Ingredient';
export const START_EDIT = '[Shopping List] Start edit';
export const STOP_EDIT = '[Shopping List] Stop edit';

export const addIngredient = createAction(
    ADD_INGREDIENT,
    props<{ingredient:Ingredient}>()
);

export const addIngredients = createAction(
    ADD_INGREDIENTS,
    props<{ingredients:Ingredient[]}>()
);

export const removeIngredient = createAction(
    REMOVE_INGREDIENT,
)

export const updateIngredient = createAction(
    UPDATE_INGREDIENT,
    props<{ingredient:Ingredient}>()
)

export const startedEditing = createAction(
    START_EDIT,
    props<{index:number}>()
)

export const stopEditing = createAction(
    STOP_EDIT
)