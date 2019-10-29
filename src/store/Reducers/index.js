import { combineReducers } from "redux"
import { User } from "./User"
import { TextEditor } from "./TextEditor"
import { Entries } from "./Entries"
import { Window } from "./Window"
import { Persistor } from "./Persistor"

export const RootReducer = combineReducers({
  User,
  TextEditor,
  Entries,
  Window,
  Persistor
})
