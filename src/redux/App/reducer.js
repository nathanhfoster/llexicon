import { AppActionTypes } from "./types"

const DEFAULT_STATE_APP = { version: 1.000 }

const App = (state = DEFAULT_STATE_APP, action) => {
  const { type, payload } = action
  switch (type) {
    case AppActionTypes.APP_SET_VERSION:
      return { ...state, version: payload }

    case AppActionTypes.REDUX_RESET:
      return state

    default:
      return state
  }
}

export { DEFAULT_STATE_APP, App }
