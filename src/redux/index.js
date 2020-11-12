import {
  Reducers,
  DEFAULT_STATE_ADMIN,
  DEFAULT_STATE_ALERTS,
  DEFAULT_STATE_APP,
  DEFAULT_STATE_CALENDAR,
  DEFAULT_STATE_ENTRIES,
  DEFAULT_STATE_MAP,
  DEFAULT_STATE_USER,
  DEFAULT_STATE_TEXT_EDITOR,
  DEFAULT_STATE_WINDOW,
  DEFAULT_STATE_ROUTER,
} from './RootReducer'
import thunk from 'redux-thunk'
import { history } from './router/reducer'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { routerMiddleware } from 'connected-react-router'
import { PersistedStorageReduxKey } from 'redux/localState'
import { deepParseJson } from 'utils'

const RootReducer = combineReducers(Reducers)

const { NODE_ENV } = process.env

const getPersistedState = () => {
  let state = {}
  try {
    state = deepParseJson(localStorage.getItem(PersistedStorageReduxKey))
  } catch (e) {
    localStorage.clear()
  }
  return state
}

const storeFactory = () => {
  const inDevelopmentMode = NODE_ENV == 'development'

  const middleWares = inDevelopmentMode
    ? composeWithDevTools(applyMiddleware(routerMiddleware(history), thunk))
    : applyMiddleware(routerMiddleware(history), thunk)

  const persistedState = getPersistedState()

  const initialState = {
    Admin: DEFAULT_STATE_ADMIN,
    Alerts: DEFAULT_STATE_ALERTS,
    App: DEFAULT_STATE_APP,
    Calendar: DEFAULT_STATE_CALENDAR,
    Entries: DEFAULT_STATE_ENTRIES,
    Map: DEFAULT_STATE_MAP,
    User: DEFAULT_STATE_USER,
    TextEditor: DEFAULT_STATE_TEXT_EDITOR,
    Window: DEFAULT_STATE_WINDOW,
    router: DEFAULT_STATE_ROUTER,
    ...persistedState,
  }

  return middleWares(createStore)(RootReducer, initialState)
}

export default storeFactory
