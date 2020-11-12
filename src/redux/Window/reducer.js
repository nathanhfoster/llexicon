import { AppActionTypes } from 'redux/App/types'
import { WindowActionTypes } from './types'
import { getWindowDimensions } from './utils'

const DEFAULT_STATE_WINDOW = {
  ...getWindowDimensions(),
}

const Window = (state = DEFAULT_STATE_WINDOW, action) => {
  const { type, payload } = action
  switch (type) {
    case WindowActionTypes.SET_WINDOW:
      return { ...state, ...getWindowDimensions() }

    // case AppActionTypes.LOAD_PERSISTED_STATE:
    //   return payload?.Window || state

    default:
      return state
  }
}

export { DEFAULT_STATE_WINDOW, Window }
