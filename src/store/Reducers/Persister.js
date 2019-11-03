import { ReduxActions } from "../../constants.js"
const { REDUX_PERSIST } = ReduxActions

const defaultState = { lastUpdated: "" }

export const Persister = (state = defaultState, action) => {
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
