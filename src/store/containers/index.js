import { Alerts } from "./Alerts/reducer"
import { App } from "./App/reducer"
import { Calendar } from "./Calendar/reducer"
import { Entries } from "./Entries/reducer"
import { Map } from "./Map/reducer"
import { router } from "./router/reducer"
import { TextEditor } from "./TextEditor/reducer"
import { User } from "./User/reducer"
import { Window } from "./Window/reducer"

const rootReducer = {
  Alerts,
  App,
  Calendar,
  Entries,
  Map,
  router,
  TextEditor,
  User,
  Window,
}

export default rootReducer
