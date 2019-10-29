import { ReduxActions } from "../../constants.js"

const defaultState = { lastUpdated: "" }

export const Persister = (state = defaultState, action) => {
  const { type, payload } = action
  switch (type) {
    // Don't update component
    case ReduxActions.REDUX_PERSIST:
      return state
    // Catch all actions
    default:
      return { ...state, lastUpdated: new Date() }
  }
}
