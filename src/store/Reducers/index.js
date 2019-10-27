import { combineReducers } from "redux"
import { User } from "./User"
import { Window } from "./Window"

export const RootReducer = combineReducers({
  User,
  Window
})
