import { Ingredient } from "../shared/ingredient.module";
import { ADD_INGREDIENT, ADD_INGREDIENTS, REMOVE_INGREDIENT, START_EDIT, STOP_EDIT, UPDATE_INGREDIENT} from "./shopping-list.actions";

export interface State {
    ingredients: Ingredient[],
    editedItemIngredient:Ingredient,
    editedItemIndex:number
}

const initialState:State = {
    ingredients: [
        new Ingredient("Salt and Pepper",12),
        new Ingredient("Tomatoes",10)
    ],
    editedItemIngredient: null,
    editedItemIndex:-1
}


export function shoppingListReducer(state:State = initialState, action:any){
    switch(action.type){
        case ADD_INGREDIENT:
            return {
                ...state,
                ingredients:[...state.ingredients,action.ingredient]
            };
        case ADD_INGREDIENTS:
            return {
                ...state,
                ingredients:[...state.ingredients,...action.ingredients]
            }
        case REMOVE_INGREDIENT:
            return {
                ...state,
                ingredients:state.ingredients.filter((ig,igIndex)=>{
                    return igIndex != state.editedItemIndex;
                }),
                editedItemIndex: -1,
                editedItemIngredient: null
            }

        case UPDATE_INGREDIENT:
            const ingredient = state.ingredients[state.editedItemIndex];
            const updatedIngredient = {
                ...ingredient,
                ...action.ingredient
            }
            const updatedIngredients = [...state.ingredients];
            updatedIngredients[state.editedItemIndex] = updatedIngredient;
            return {
                ...state,
                ingredients: updatedIngredients,
                editedItemIndex: -1,
                editedItemIngredient: null
            }
        case START_EDIT:
            return {
                ...state,
                editedItemIndex : action.index,
                editedItemIngredient: {...state.ingredients[action.index]} 
            }
        case STOP_EDIT:
            return{
                ...state,
                editedItemIndex: -1,
                editedItemIngredient: null
            }
        default:
            return state;    
    }
}