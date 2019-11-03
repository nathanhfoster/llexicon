import { ReduxActions } from "../../constants.js"
const { SET_WINDOW } = ReduxActions

const defaultState = {
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

export const Window = (state = defaultState, action) => {
  const { type, payload } = action
  switch (type) {
    case SET_WINDOW:
      return payload
    default:
      return state
  }
}
