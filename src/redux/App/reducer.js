import actions from '../actionTypes'
import { getProgressEventData } from './utils'

export const DEFAULT_STATE_APP = {
  isPending: true,
  version: new Number(1).toFixed(3),
  localStorageCapacity: null,
  localStorageUsage: null,
  localStorageQuota: null,
  localStorageUsageDetails: null,
  uploadProgress: {},
  downloadProgress: {},
}

export const App = (state = DEFAULT_STATE_APP, action) => {
  const { type, payload } = action
  switch (type) {
    case actions.APP_SET_VERSION:
      return { ...state, version: payload.toFixed(3) }

    case actions.APP_SET_LOCAL_STORAGE_USAGE:
      return { ...state, ...payload }

    case actions.APP_UPLOAD_PROGRESS:
      return {
        ...state,
        uploadProgress: getProgressEventData(payload),
      }

    case actions.APP_DOWNLOAD_PROGRESS:
      return { ...state, downloadProgress: getProgressEventData(payload) }

    case actions.REDUX_RESET:
      return state

    case actions.LOAD_PERSISTED_STATE_PENDING:
      return { ...state, isPending: true }

    case actions.LOAD_PERSISTED_STATE:
      return {
        ...state,
        isPending: false,
        uploadProgress: DEFAULT_STATE_APP.uploadProgress,
        downloadProgress: DEFAULT_STATE_APP.downloadProgress,
      }

    default:
      return state
  }
}
