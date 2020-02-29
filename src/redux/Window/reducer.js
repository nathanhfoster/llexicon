import { WindowActionTypes } from "./types"
import { AppActionTypes } from "../App/types"
import { getWindowDimensions } from "./utils"

const DEFAULT_STATE_WINDOW = {
  version: new Date(),
  ...getWindowDimensions()
}

const Window = (state = DEFAULT_STATE_WINDOW, action) => {
  const { type, payload } = action
  switch (type) {
    case WindowActionTypes.SET_WINDOW:
      return { ...state, ...getWindowDimensions() }
    case AppActionTypes.SET_APP_VERSION:
      return { ...state, version: payload }
    default:
      return state
  }
}

export { DEFAULT_STATE_WINDOW, Window }
