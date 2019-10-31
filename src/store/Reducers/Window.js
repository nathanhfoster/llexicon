import { ReduxActions } from "../../constants.js"

const defaultState = {
  innerHeight: null,
  innerWidth: null,
  isMobile: null,
  screen: null,
  performance: null
}

export const Window = (state = defaultState, action) => {
  const { type, payload } = action
  switch (type) {
    case ReduxActions.SET_WINDOW:
      return payload
    default:
      return state
  }
}
