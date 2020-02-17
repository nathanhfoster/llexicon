import { WindowActionTypes } from "./types"
import { AppActionTypes } from "../App/types"
import { getWindowDimensions } from "./utils"

const DEFAULT_STATE_WINDOW = {
  version: new Date(),
  innerHeight: null,
  innerWidth: null,
  isMobile: null,
  screen: {
    availHeight: null,
    availLeft: null,
    availTop: null,
    availWidth: null,
    colorDepth: null,
    height: null,
    pixelDepth: null,
    width: null
  },
  performance: {
    timeOrigin: null,
    timing: {
      navigationStart: null,
      unloadEventStart: null,
      unloadEventEnd: null,
      redirectStart: null,
      redirectEnd: null,
      fetchStart: null,
      domainLookupStart: null,
      domainLookupEnd: null,
      connectStart: null,
      connectEnd: null,
      secureConnectionStart: null,
      requestStart: null,
      responseStart: null,
      responseEnd: null,
      domLoading: null,
      domInteractive: null,
      domContentLoadedEventStart: null,
      domContentLoadedEventEnd: null,
      domComplete: null,
      loadEventStart: null,
      loadEventEnd: null
    },
    navigation: { type: null, redirectCount: null }
  }
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
