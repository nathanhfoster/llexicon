import { WindowActionTypes } from "./types"
import { getWindowDimensions } from "./utils"

const DEFAULT_STATE_WINDOW = {
  ...getWindowDimensions(),
}

const Window = (state = DEFAULT_STATE_WINDOW, action) => {
  const { type, payload } = action
  switch (type) {
    case WindowActionTypes.SET_WINDOW:
      return { ...state, ...getWindowDimensions() }

    default:
      return state
  }
}

export { DEFAULT_STATE_WINDOW, Window }
