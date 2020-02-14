import { ReduxActions } from "../../constants.js"
const { REDUX_PERSIST, ENTRY_IMPORT, ALERTS_CLEAR } = ReduxActions

const DEFAULT_STATE_PERSISTER = { _lastUpdated: "", shouldDelay: true }

const Persister = (state = DEFAULT_STATE_PERSISTER, action) => {
  const { type, payload } = action
  switch (type) {
    case ALERTS_CLEAR:
      return { ...state, _lastUpdated: new Date(), shouldDelay: false }
    // Don't update component
    case ENTRY_IMPORT:
      return state
    case REDUX_PERSIST:
      return state
    // Catch all actions
    default:
      return { ...state, _lastUpdated: new Date(), shouldDelay: true }
  }
}

export { DEFAULT_STATE_PERSISTER, Persister }
