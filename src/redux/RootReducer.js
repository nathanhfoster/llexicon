import { combineReducers } from "redux"
import { DEFAULT_STATE_ALERTS, Alerts } from "./Alerts/reducer"
import { DEFAULT_STATE_CALENDAR, Calendar } from "./Calendar/reducer"
import { DEFAULT_STATE_USER, User } from "./User/reducer"
import { DEFAULT_STATE_TEXT_EDITOR, TextEditor } from "./TextEditor/reducer"
import { DEFAULT_STATE_ENTRIES, Entries } from "./Entries/reducer"
import { DEFAULT_STATE_WINDOW, Window } from "./Window/reducer"

const RootReducer = combineReducers({
  Alerts,
  Calendar,
  User,
  TextEditor,
  Entries,
  Window,
})

export {
  RootReducer,
  DEFAULT_STATE_ALERTS,
  DEFAULT_STATE_CALENDAR,
  DEFAULT_STATE_USER,
  DEFAULT_STATE_TEXT_EDITOR,
  DEFAULT_STATE_ENTRIES,
  DEFAULT_STATE_WINDOW,
}
