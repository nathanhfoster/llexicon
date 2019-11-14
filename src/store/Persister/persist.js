import { ReduxActions } from "../../constants"
import { removeKeyFromObject } from "../../helpers"

const LocalStorageReduxKey = "ReduxStore"
const LocalStorageFilesKey = "Files"

const saveState = (localStorageKey, value, dispatch) => {
  const stateValue = JSON.stringify(value)
  try {
    localStorage.setItem(localStorageKey, stateValue)
    if (dispatch) dispatch()
  } catch (e) {
    if (isQuotaExceeded(e)) {
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

const removeState = (localStorageKey, keyToRemove) => {
  if (keyToRemove) {
    const state = getState(localStorageKey)
    const newState = removeKeyFromObject(state, keyToRemove)
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

const saveFileState = files => saveState(LocalStorageFilesKey, files)

const appendFileToState = (key, file) => {
  let state = getState(LocalStorageFilesKey)
  const {
    lastModified,
    lastModifiedDate,
    name,
    size,
    type,
    webkitRelativePath
  } = file

  state[key] = {
    lastModified,
    lastModifiedDate,
    name,
    size,
    type,
    webkitRelativePath
  }

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
  getReduxState,
  saveFileState,
  appendFileToState,
  removeFilesFromState,
  removeFileFromState,
  saveReduxState,
  removeReduxState
}
