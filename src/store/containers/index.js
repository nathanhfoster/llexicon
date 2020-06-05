import { Alerts } from "../../redux/redux/Alerts/reducer"
import { App } from "../../redux/App/reducer"
import { Calendar } from "../../redux/Calendar/reducer"
import { Entries } from "../../redux/Entries/reducer"
import { Map } from "../../redux/Map/reducer"
import { router } from "../../redux/router/reducer"
import { TextEditor } from "../../redux/TextEditor/reducer"
import { User } from "../../redux/User/reducer"
import { Window } from "../../redux/Window/reducer"

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
