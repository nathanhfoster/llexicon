import { RootReducer } from "./RootReducer"
import thunk from "redux-thunk"
import { createStore, applyMiddleware } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import { persistStore, persistReducer } from "redux-persist"
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2"
import storage from "redux-persist/lib/storage" // defaults to localStorage for web
import { LocalStorageReduxKey } from "./localState"

const { NODE_ENV } = process.env

const persistConfig = {
  key: LocalStorageReduxKey,
  storage,
  stateReconciler: autoMergeLevel2
}

const persistedReducer = persistReducer(persistConfig, RootReducer)

export default () => {
  const inDevelopmentMode = NODE_ENV == "development"

  const middleWares = inDevelopmentMode
    ? composeWithDevTools(applyMiddleware(thunk))
    : applyMiddleware(thunk)

  const store = createStore(persistedReducer, middleWares)

  const persistor = persistStore(store)

  return { store, persistor }
}
