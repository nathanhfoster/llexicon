import actions from '../actionTypes'
import axios from 'axios'
import { getLocalStorageCapacity } from './utils'
const { PUBLIC_URL } = process.env

export const SetLocalStorageUsage = () => (dispatch, getState) => {
  const { localStorageCapacity: localStorageCapacityFromRedux } = getState().App
  const localStorageCapacity = localStorageCapacityFromRedux || getLocalStorageCapacity()

  let payload = { localStorageCapacity }

  if (navigator?.storage?.estimate) {
    return navigator.storage.estimate().then(({ usage, quota, usageDetails }) => {
      payload = {
        ...payload,
        localStorageUsage: usage,
        localStorageQuota: quota,
        localStorageUsageDetails: usageDetails,
      }
      dispatch({ type: actions.APP_SET_LOCAL_STORAGE_USAGE, payload })
      return [usage, quota]
    })
  } else {
    dispatch({ type: actions.APP_SET_LOCAL_STORAGE_USAGE, payload })
  }
}

export const ResetRedux = () => ({ type: actions.REDUX_RESET })

export const GetAppVersion = () => (dispatch, getState) => {
  const {
    App: { version },
  } = getState()
  return axios
    .get(`${PUBLIC_URL}/version.txt`)
    .then(({ data }) => {
      dispatch({ type: actions.APP_SET_VERSION, payload: data })

      return { currentVersion: version, latestVersion: data }
    })
    .catch(({ response }) => console.log('ERROR: ', response))
}

export const LoadReducerStatePending = () => ({ type: actions.LOAD_PERSISTED_STATE_PENDING })

export const LoadReducerState = state => dispatch => {
  const payload = state || {}
  dispatch({
    type: actions.LOAD_PERSISTED_STATE,
    payload,
  })
  return new Promise(resolve => resolve(payload))
}

export const UploadProgress = payload => ({ type: actions.APP_UPLOAD_PROGRESS, payload })
export const DownloadProgress = payload => ({ type: actions.APP_DOWNLOAD_PROGRESS, payload })
