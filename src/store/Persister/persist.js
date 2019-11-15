import { ReduxActions } from "../../constants"
import { getObjectLength, removeKeyOrValueFromObject } from "../../helpers"

const LocalStorageReduxKey = "ReduxStore"
const LocalStorageFilesKey = "Files"

const saveState = (localStorageKey, value, dispatch) => {
  const stateValue = JSON.stringify(value)
  try {
    localStorage.setItem(localStorageKey, stateValue)
    if (dispatch) dispatch()
  } catch (e) {
    if (isQuotaExceeded(e)) {
      clearLocalStorage()
      // Do something
    }
  }
}

const getState = localStorageKey => {
  let state = {}

  const localState = localStorage.getItem(localStorageKey)

  if (localState) {
    state = JSON.parse(localState)
  } else {
    saveState(localStorageKey, state)
  }

  return state
}

const clearLocalStorage = () => localStorage.clear()

const removeState = (localStorageKey, keyOrValueToRemove) => {
  if (keyOrValueToRemove) {
    const state = getState(localStorageKey)
    const newState = removeKeyOrValueFromObject(state, keyOrValueToRemove)
    saveState(localStorageKey, newState)
  } else {
    localStorage.removeItem(localStorageKey)
  }
}

const getBlob = key => getState(LocalStorageFilesKey)[key]

const getFile = key => {
  // console.log("key: ", key)
  const state = getFilesState()
  // console.log("state: ", state)
  const file = state[key]
  // console.log("file: ", file)
  return file
}

const getFilesState = () => getState(LocalStorageFilesKey)

const getFilesStateLength = () => getObjectLength(getFilesState())

const saveFileState = files => saveState(LocalStorageFilesKey, files)

const appendFileToState = (key, imageBase64) => {
  let state = getState(LocalStorageFilesKey)

  state[key] = imageBase64

  saveState(LocalStorageFilesKey, state)
}

const removeFilesFromState = () => removeState(LocalStorageFilesKey)

const removeFileFromState = file => removeState(LocalStorageFilesKey, file)

const getReduxState = () => getState(LocalStorageReduxKey)

const saveReduxState = () => (dispatch, getState) =>
  saveState(
    LocalStorageReduxKey,
    getState(),
    dispatch({ type: ReduxActions.REDUX_PERSIST })
  )

const removeReduxState = () => removeState(LocalStorageReduxKey)

const isQuotaExceeded = e => {
  let quotaExceeded = false
  if (e) {
    if (e.code) {
      switch (e.code) {
        case 22:
          quotaExceeded = true
          break
        case 1014:
          // Firefox
          if (e.name === "NS_ERROR_DOM_QUOTA_REACHED") {
            quotaExceeded = true
          }
          break
        default:
          break
      }
    } else if (e.number === -2147024882) {
      // Internet Explorer 8
      quotaExceeded = true
    }
  }
  return quotaExceeded
}

export {
  clearLocalStorage,
  getFile,
  getFilesState,
  getFilesStateLength,
  getReduxState,
  saveFileState,
  appendFileToState,
  removeFilesFromState,
  removeFileFromState,
  saveReduxState,
  removeReduxState
}
