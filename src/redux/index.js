import { RootReducer } from "./RootReducer"
import thunk from "redux-thunk"
import { history } from "./router/reducer"
import { createStore, applyMiddleware } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import { persistStore, persistReducer } from "redux-persist"
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2"
import storage from "redux-persist/lib/storage" // defaults to localStorage for web
import { LocalStorageReduxKey, handleQuotaExceeded } from "./localState"
import { routerMiddleware } from "connected-react-router"

const { NODE_ENV } = process.env

const persistConfig = {
  key: LocalStorageReduxKey,
  storage,
  stateReconciler: autoMergeLevel2,
  writeFailHandler: handleQuotaExceeded,
  // blacklist: ["Admin"], // Admin reducer will not be persisted
}

const persistedReducer = persistReducer(persistConfig, RootReducer(history))

const storeFactory = () => {
  const inDevelopmentMode = NODE_ENV == "development"

  const middleWares = inDevelopmentMode
    ? composeWithDevTools(applyMiddleware(routerMiddleware(history), thunk))
    : applyMiddleware(routerMiddleware(history), thunk)

  const store = createStore(persistedReducer, middleWares)

  const persistor = persistStore(store)

  return { store, persistor }
}

export default storeFactory
