import { combineReducers } from "redux"
import { Alerts } from "./Alerts"
import { Calendar } from "./Calendar"
import { User } from "./User"
import { TextEditor } from "./TextEditor"
import { Entries } from "./Entries"
import { Window } from "./Window"
import { Persister } from "./Persister"

export const RootReducer = combineReducers({
  Alerts,
  Calendar,
  User,
  TextEditor,
  Entries,
  Window,
  Persister
})
