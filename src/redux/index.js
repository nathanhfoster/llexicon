import { Reducers } from './RootReducer'
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
