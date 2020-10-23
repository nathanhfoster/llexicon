import { Reducers,
  DEFAULT_STATE_ADMIN,
  DEFAULT_STATE_ALERTS,
  DEFAULT_STATE_APP,
  DEFAULT_STATE_CALENDAR,
  DEFAULT_STATE_ENTRIES,
  DEFAULT_STATE_MAP,
  DEFAULT_STATE_USER,
  DEFAULT_STATE_TEXT_EDITOR,
  DEFAULT_STATE_WINDOW
} from './RootReducer'
import thunk from 'redux-thunk'
import { history } from './router/reducer'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { routerMiddleware } from 'connected-react-router'

const RootReducer = combineReducers(Reducers)

const { NODE_ENV } = process.env

const storeFactory = initialState => {
  const inDevelopmentMode = NODE_ENV == 'development'

  const middleWares = inDevelopmentMode
    ? composeWithDevTools(applyMiddleware(routerMiddleware(history), thunk))
    : applyMiddleware(routerMiddleware(history), thunk)

  return middleWares(createStore)(RootReducer, initialState || {})
}

export default storeFactory
