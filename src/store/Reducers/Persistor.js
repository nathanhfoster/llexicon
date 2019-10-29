import { ReduxActions } from "../../constants.js"

const defaultState = { lastUpdated: "" }

export const Persistor = (state = defaultState, action) => {
  const { type, payload } = action
  switch (type) {
    // case ReduxActions.REDUX_PERSIST:
    //   return { ...state, lastUpdated: new Date() }
    // Catch all actions
    default:
      return { ...state, lastUpdated: new Date() }
  }
}
