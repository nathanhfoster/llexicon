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
  matchMedia: null,
  navigator: {
    appCodeName: null,
    appName: null,
    appVersion: null,
    bluetooth: null,
    clipboard: null,
    connection: {},
    cookieEnabled: null,
    credentials: null,
    deviceMemory: null,
    doNotTrack: null,
    geolocation: null,
    hardwareConcurrency: null,
    keyboard: null,
    language: null,
    languages: null,
    locks: null,
    maxTouchPoints: null,
    mediaCapabilities: null,
    mediaDevices: { ondevicechange: null },
    mediaSession: { metadata: null, playbackState: null },
    mimeTypes: null,
    onLine: null,
    permissions: null,
    platform: null,
    plugins: null,
    presentation: { defaultRequest: null, receiver: null },
    product: null,
    productSub: null,
    serviceWorker: {
      controller: null,
      oncontrollerchange: null,
      onmessage: null
    },
    storage: null,
    usb: null,
    userActivation: { hasBeenActive: null, isActive: null },
    userAgent: null,
    vendor: null,
    vendorSub: null
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
      const windowProps = getWindowDimensions()
      return { ...state, ...windowProps }
    case AppActionTypes.SET_APP_VERSION:
      return { ...state, version: payload }
    default:
      return state
  }
}

export { DEFAULT_STATE_WINDOW, Window }
