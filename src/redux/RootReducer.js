import { combineReducers } from "redux"
import { DEFAULT_STATE_ALERTS, Alerts } from "./Alerts/reducer"
import { DEFAULT_STATE_APP, App } from "./App/reducer"
import { DEFAULT_STATE_CALENDAR, Calendar } from "./Calendar/reducer"
import { DEFAULT_STATE_USER, User } from "./User/reducer"
import { DEFAULT_STATE_TEXT_EDITOR, TextEditor } from "./TextEditor/reducer"
import { DEFAULT_STATE_ENTRIES, Entries } from "./Entries/reducer"
import { DEFAULT_STATE_MAP, Map } from "./Map/reducer"
import { DEFAULT_STATE_WINDOW, Window } from "./Window/reducer"

const RootReducer = combineReducers({
  Alerts,
  App,
  Calendar,
  Entries,
  Map,
  User,
  TextEditor,
  Window,
})

export {
  RootReducer,
  DEFAULT_STATE_ALERTS,
  DEFAULT_STATE_APP,
  DEFAULT_STATE_CALENDAR,
  DEFAULT_STATE_ENTRIES,
  DEFAULT_STATE_MAP,
  DEFAULT_STATE_USER,
  DEFAULT_STATE_TEXT_EDITOR,
  DEFAULT_STATE_WINDOW,
}
