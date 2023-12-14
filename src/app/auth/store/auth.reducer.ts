import { User } from "../user.model";
import * as Authactions from './auth.actions';

export interface State{
    user:User;
    authError:string;
    loading:boolean;
}

const initialState ={
    user:null,
    authError:null,
    loading:false
}

export function authReducer(state=initialState,action:any){
    switch(action.type){
        case Authactions.AUTHENTICATE_SUCCESS:
            const userLoggedIn = new User(action.payload.email,action.payload.userId,action.payload.token,action.payload.tokenExpirationDate);
            return{
                ...state,
                user:userLoggedIn,
                authError:null,
                loading:false
            }
        case Authactions.LOGOUT:
            return {
                ...state,
                user:null,
            }
        case Authactions.LOGIN_START:
        case Authactions.SIGN_UP_START:
            return {
                ...state,
                authError:null,
                loading:true
            }
        case Authactions.AUTHENTICATE_FAILURE:
            return {
                ...state,
                user:null,
                authError:action.payload,
                loading:false
            }
        case Authactions.ERROR_CLEAR:
            return {
                ...state,
                authError:null
            }
        default:
            return state;
    }
}