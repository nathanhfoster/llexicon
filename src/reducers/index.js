// import { Reducers } from "./RootReducer"
// import thunk from "redux-thunk"
// import { history } from "./router/reducer"
// import { createStore, applyMiddleware, combineReducers } from "redux"
// import { composeWithDevTools } from "redux-devtools-extension"
// import { persistStore, persistReducer } from "redux-persist"
// import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2"
// import storage from "redux-persist/lib/storage" // defaults to localStorage for web
// import { LocalStorageReduxKey, handleQuotaExceeded } from "./localState"

// const RootReducer = combineReducers(Reducers)

// const { NODE_ENV } = process.env

// const persistConfig = {
//   key: LocalStorageReduxKey,
//   storage,
//   stateReconciler: autoMergeLevel2,
//   writeFailHandler: handleQuotaExceeded,
//   blacklist: ["Admin"], // Admin reducer will not be persisted
// }

// const persistedReducer = persistReducer(persistConfig, RootReducer)

// const storeFactory = () => {
//   const inDevelopmentMode = NODE_ENV == "development"

//   const middleWares = inDevelopmentMode
//     ? composeWithDevTools(applyMiddleware(thunk))
//     : applyMiddleware(thunk)

//   const store = createStore(persistedReducer, middleWares)

//   const persistor = persistStore(store)

//   return { store, persistor }
// }

// export default storeFactory