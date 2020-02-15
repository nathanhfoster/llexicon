import { RootReducer } from "./RootReducer"
import thunk from "redux-thunk"
import { createStore, applyMiddleware } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
const { NODE_ENV } = process.env
const initialState = {}

export default (state = initialState) => {
  const inDevelopmentMode = NODE_ENV == "development"
  return inDevelopmentMode
    ? composeWithDevTools(applyMiddleware(thunk))(createStore)(
        RootReducer,
        state
      )
    : applyMiddleware(thunk)(createStore)(RootReducer, state)
}
