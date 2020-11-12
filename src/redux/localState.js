import { getObjectLength, removeKeyOrValueFromObject } from '../utils'
import { deepParseJson } from '../utils'
import {
  DEFAULT_STATE_APP,
  DEFAULT_STATE_ALERTS,
  DEFAULT_STATE_CALENDAR,
  DEFAULT_STATE_USER,
  DEFAULT_STATE_TEXT_EDITOR,
  DEFAULT_STATE_ENTRIES,
  DEFAULT_STATE_WINDOW,
} from './RootReducer'

const IndexDbKey = 'AstralTreeDB'
const LocalStorageReduxKey = 'ReduxStore'
const PersistedStorageReduxKey = `persist:${LocalStorageReduxKey}`
const LocalStorageFilesKey = 'Files'

const cleanHtml = array =>
  array.map(
    item =>
      (item = {
        ...item,
        html: '<p></p>',
      }),
  )

const saveState = (localStorageKey, value, dispatch) => {
  const stateValue = JSON.stringify(value)
  try {
    localStorage.setItem(localStorageKey, stateValue)
    if (dispatch) dispatch()
  } catch (e) {
    if (isQuotaExceeded(e)) {
      const { User, Window } = getReduxState()
      clearLocalStorage()

      const reduxStore = {
        Alerts: DEFAULT_STATE_ALERTS,
        Calendar: DEFAULT_STATE_CALENDAR,
        User,
        TextEditor: DEFAULT_STATE_TEXT_EDITOR,
        Entries: DEFAULT_STATE_ENTRIES,
        Window,
      }

      saveState(LocalStorageReduxKey, reduxStore, dispatch)
    }
  }
}

const getState = localStorageKey => {
  let state = null

  const localStateString = localStorage.getItem(localStorageKey)

  if (localStateString) {
    state = deepParseJson(localStateString)
  } else {
    saveState(localStorageKey, state)
  }

  return state
}

const clearLocalStorage = () => localStorage.clear()

const clearReduxStoreFromLocalStorage = () => localStorage.removeItem(PersistedStorageReduxKey)

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
  const state = getFilesState()
  const file = state[key]
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

const getPersistedReduxStore = () => getState(PersistedStorageReduxKey)

const saveReduxState = () => (dispatch, getState) => saveState(LocalStorageReduxKey, getState())

const persistReduxState = () => (dispatch, getState) =>
  saveState(PersistedStorageReduxKey, getState())

const removeReduxState = () => removeState(LocalStorageReduxKey)

const Clean = array => {
  for (let i = 0; i < array.length; i++) {
    const item = array[i]
    if (item.hasOwnProperty('html')) delete item.html
    if (item.hasOwnProperty('image')) delete item.image
  }
  return array.filter(e => e)
}

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
          if (e.name == 'NS_ERROR_DOM_QUOTA_REACHED') {
            quotaExceeded = true
          }
          break
      }
    } else if (e.number == -2147024882) {
      // Internet Explorer 8
      quotaExceeded = true
    }
  }
  return quotaExceeded
}

const getUser = () => {
  let userFromLocalStorage = {}
  const persistedReduxStore = localStorage.getItem(PersistedStorageReduxKey)

  if (persistedReduxStore) {
    const persistedReduxStoreObject = JSON.parse(persistedReduxStore)
    const { User } = persistedReduxStoreObject
    if (!User) return { token: null, offline_mode: null, Settings: {} }
    else if (typeof User === 'string') {
      userFromLocalStorage = JSON.parse(User)
    } else {
      userFromLocalStorage = User
    }
  }

  if (!userFromLocalStorage.Settings) {
    userFromLocalStorage.Settings = {}
  }

  return userFromLocalStorage
}

const getUserClientId = () => {
  let userClientId = {}
  const persistedStore = localStorage.getItem(PersistedStorageReduxKey)

  if (persistedStore) {
    const {
      App: { version },
      Window,
    } = JSON.parse(persistedStore)

    const { id, username, email } = getUser()

    const appVersion = Window?.navigator?.appVersion || DEFAULT_STATE_APP.version

    const userId = id
    const clientId = appVersion
    const userIdUsernameEmail = `${id}-${username}-${email}`

    userClientId = { userId, version, appVersion, userIdUsernameEmail }
  }

  return userClientId
}

const handleQuotaExceeded = e => {
  if (isQuotaExceeded(e)) {
  }
}

export {
  IndexDbKey,
  LocalStorageReduxKey,
  PersistedStorageReduxKey,
  clearLocalStorage,
  clearReduxStoreFromLocalStorage,
  getFile,
  getFilesState,
  getFilesStateLength,
  getReduxState,
  getPersistedReduxStore,
  saveFileState,
  appendFileToState,
  removeFilesFromState,
  removeFileFromState,
  saveReduxState,
  persistReduxState,
  removeReduxState,
  getUser,
  getUserClientId,
  handleQuotaExceeded,
  isQuotaExceeded,
}
