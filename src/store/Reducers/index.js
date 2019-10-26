import { combineReducers } from "redux";
import { User } from "./User";
import { Resume } from "./Resume";
import { Window } from "./Window";

export const RootReducer = combineReducers({
  User,
  Resume,
  Window
});
