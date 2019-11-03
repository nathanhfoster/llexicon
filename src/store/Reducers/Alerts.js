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

const defaultState = { title: "", message: "" }

export const Alerts = (state = defaultState, action) => {
  const { type, payload } = action
  switch (type) {
    case ALERTS_SET_MESSAGE:
      return { ...state, ...payload }
    case ALERTS_CLEAR:
      return defaultState
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
      return defaultState
    default:
      return state
  }
}
