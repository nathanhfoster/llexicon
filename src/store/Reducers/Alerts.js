import { ReduxActions } from "../../constants.js"
const {
  ALERTS_SET_MESSAGE,
  ALERTS_CLEAR,
  USER_SET,
  USER_SET_SETTINGS,
  ENTRY_IMPORT,
  ENTRY_POST,
  ENTRY_UPDATE,
  ENTRY_DELETE,
  REDUX_RESET
} = ReduxActions

const DEFAULT_STATE_ALERTS = { title: "", message: "" }

const Alerts = (state = DEFAULT_STATE_ALERTS, action) => {
  const { type, payload } = action
  switch (type) {
    case ALERTS_SET_MESSAGE:
      return { ...state, ...payload }
    case ALERTS_CLEAR:
      return DEFAULT_STATE_ALERTS
    // case USER_SET_SETTINGS:
    //   return { ...state, title: "Updated", message: "Settings" }
    // case ENTRY_IMPORT:
    //   return { ...state, title: "Imported", message: "Entry" }
    // case ENTRY_POST:
    //   return { ...state, title: "Posted", message: "Entry" }
    // case ENTRY_UPDATE:
    //   return { ...state, title: "Updated", message: "Entry" }
    // case ENTRY_DELETE:
    //   return { ...state, title: "Deleted", message: "Entry" }
    case REDUX_RESET:
      return DEFAULT_STATE_ALERTS
    default:
      return state
  }
}

export { DEFAULT_STATE_ALERTS, Alerts }
