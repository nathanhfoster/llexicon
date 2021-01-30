import actions from '../actionTypes'
import { getWindowDimensions } from './utils'

export const DEFAULT_STATE_WINDOW = {
  ...getWindowDimensions(),
}

export const Window = (state = DEFAULT_STATE_WINDOW, action) => {
  const { type, payload } = action
  switch (type) {
    case actions.SET_WINDOW:
      return { ...state, ...getWindowDimensions() }

    // case actions.LOAD_PERSISTED_STATE:
    //   return payload?.Window || state

    default:
      return state
  }
}
