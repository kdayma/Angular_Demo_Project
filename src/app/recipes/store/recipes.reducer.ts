import { Recipe } from "../recipe.model";
import { ADD_RECIPE, REMOVE_RECIPE, SET_RECIPES, UPDATE_RECIPE } from "./recipes.actions";

export interface State {
    recipes:Recipe[];
}

const initialState = {
    recipes:[]
}


export function recipeReducer(state=initialState,action:any){
    switch(action.type){
        case SET_RECIPES:
            return{
                ...state,
                recipes:[...action.payload]
            }
        case ADD_RECIPE:
            return {
                ...state,
                recipes:[...state.recipes,action.payload]
            }
        case UPDATE_RECIPE:
            const updatedRecipe = {
                ...state.recipes[action.payload.id],
                ...action.payload.updatedRecipe
            };

            const updatedRecipes = [...state.recipes];
            updatedRecipes[action.payload.id] = updatedRecipe;
            return {
                ...state,
                recipes:updatedRecipes
            }
        case REMOVE_RECIPE:
            return{
                ...state,
                recipes:state.recipes.filter((recipe,index)=>{
                    return index !== action.payload
                })
            }
        default:
            return state;
    }
}