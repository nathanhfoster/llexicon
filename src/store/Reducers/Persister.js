import { ReduxActions } from "../../constants.js"
const { REDUX_PERSIST } = ReduxActions

const DEFAULT_STATE_PERSISTER = { lastUpdated: "" }

const Persister = (state = DEFAULT_STATE_PERSISTER, action) => {
  const { type, payload } = action
  switch (type) {
    // Don't update component
    case REDUX_PERSIST:
      return state
    // Catch all actions
    default:
      return { ...state, lastUpdated: new Date() }
  }
}

export { DEFAULT_STATE_PERSISTER, Persister }
