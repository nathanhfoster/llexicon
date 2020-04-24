import { AppActionTypes } from "./types"

const DEFAULT_STATE_APP = { version: new Number(1).toFixed(3), localStorageUsage: null, localStorageQuota: null }

const App = (state = DEFAULT_STATE_APP, action) => {
  const { type, payload } = action
  switch (type) {
    case AppActionTypes.APP_SET_VERSION:
      return { ...state, version: payload.toFixed(3) }

    case AppActionTypes.REDUX_RESET:
      return state

    default:
if ('storage' in navigator && 'estimate' in navigator.storage) {
  navigator.storage.estimate().then(({usage, quota}) => {
    return {...state, localStorageUsage: usage, localStorageQuota: quota}
  })
}
else
      return state
  }
}

export { DEFAULT_STATE_APP, App }
