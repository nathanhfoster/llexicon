import { AppActionTypes } from "./types"

const DEFAULT_STATE_APP = {
  version: new Number(1).toFixed(3),
  localStorageUsage: null,
  localStorageQuota: null,
  localStorageUsageDetails: null,
}

const App = (state = DEFAULT_STATE_APP, action) => {
  const { type, payload } = action
  switch (type) {
    case AppActionTypes.APP_SET_VERSION:
      return { ...state, version: payload.toFixed(3) }

    case AppActionTypes.APP_SET_LOCAL_STORAGE_USAGE:
      return { ...state, ...payload }

    case AppActionTypes.REDUX_RESET:
      return state

    default:
      return state
  }
}

export { DEFAULT_STATE_APP, App }
