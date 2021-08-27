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

export const IndexDbKey = 'AstralTreeDB'

export const LocalStorageReduxKey = 'ReduxStore'

export const PersistedStorageReduxKey = `persist:${LocalStorageReduxKey}`

export const LocalStorageFilesKey = 'Files'

export const cleanHtml = array =>
  array.map(
    item =>
      (item = {
        ...item,
        html: '<p></p>',
      }),
  )

export const saveState = (localStorageKey, value, dispatch) => {
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

export const getState = localStorageKey => {
  let state = null

  const localStateString = localStorage.getItem(localStorageKey)

  if (localStateString) {
    state = deepParseJson(localStateString)
  } else {
    saveState(localStorageKey, state)
  }

  return state
}

export const clearLocalStorage = () => localStorage.clear()

export const clearReduxStoreFromLocalStorage = () =>
  localStorage.removeItem(PersistedStorageReduxKey)

export const removeState = (localStorageKey, keyOrValueToRemove) => {
  if (keyOrValueToRemove) {
    const state = getState(localStorageKey)
    const newState = removeKeyOrValueFromObject(state, keyOrValueToRemove)
    saveState(localStorageKey, newState)
  } else {
    localStorage.removeItem(localStorageKey)
  }
}

export const getBlob = key => getState(LocalStorageFilesKey)[key]

export const getFile = key => {
  const state = getFilesState()
  const file = state[key]
  return file
}

export const getFilesState = () => getState(LocalStorageFilesKey)

export const getFilesStateLength = () => getObjectLength(getFilesState())

export const saveFileState = files => saveState(LocalStorageFilesKey, files)

export const appendFileToState = (key, imageBase64) => {
  let state = getState(LocalStorageFilesKey)

  state[key] = imageBase64

  saveState(LocalStorageFilesKey, state)
}

export const removeFilesFromState = () => removeState(LocalStorageFilesKey)

export const removeFileFromState = file => removeState(LocalStorageFilesKey, file)

export const getReduxState = () => getState(LocalStorageReduxKey)

export const getPersistedReduxStore = () => getState(PersistedStorageReduxKey)

export const saveReduxState = () => (dispatch, getState) =>
  saveState(LocalStorageReduxKey, getState())

export const persistReduxState = () => (dispatch, getState) =>
  saveState(PersistedStorageReduxKey, getState())

export const removeReduxState = () => removeState(LocalStorageReduxKey)

export const Clean = array => {
  for (let i = 0; i < array.length; i++) {
    const item = array[i]
    if (item.hasOwnProperty('html')) delete item.html
    if (item.hasOwnProperty('image')) delete item.image
  }
  return array.filter(e => e)
}

export const isQuotaExceeded = e => {
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

export const getUser = () => {
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

export const getUserClientId = () => {
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

export const handleQuotaExceeded = e => {
  if (isQuotaExceeded(e)) {
  }
}
