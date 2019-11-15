import { combineReducers } from "redux"
import { DEFAULT_STATE_ALERTS, Alerts } from "./Alerts"
import { DEFAULT_STATE_CALENDAR, Calendar } from "./Calendar"
import { DEFAULT_STATE_USER, User } from "./User"
import { DEFAULT_STATE_TEXT_EDITOR, TextEditor } from "./TextEditor"
import { DEFAULT_STATE_ENTRIES, Entries } from "./Entries"
import { DEFAULT_STATE_WINDOW, Window } from "./Window"
import { DEFAULT_STATE_PERSISTER, Persister } from "./Persister"

const RootReducer = combineReducers({
  Alerts,
  Calendar,
  User,
  TextEditor,
  Entries,
  Window,
  Persister
})

export {
  RootReducer,
  DEFAULT_STATE_ALERTS,
  DEFAULT_STATE_CALENDAR,
  DEFAULT_STATE_USER,
  DEFAULT_STATE_TEXT_EDITOR,
  DEFAULT_STATE_ENTRIES,
  DEFAULT_STATE_WINDOW,
  DEFAULT_STATE_PERSISTER
}
