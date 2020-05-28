import * as React from "react"
import PropTypes from "prop-types"

import { deepParseJson, combineReducers } from "../utils"
import { PersistedStorageReduxKey } from "../../redux/localState"

const AppStateProvider = React.createContext({})

const defaultInitializer = (state) => state

const ContextProvider = ({
  rootReducer,
  initialState,
  initializer = defaultInitializer,
  children,
}) => {
  // const persistedState = deepParseJson(
  //   localStorage.getItem(PersistedStorageReduxKey)
  // )

  const isASingleReducer = React.useMemo(
    () => rootReducer instanceof Function || typeof rootReducer === "function",
    [rootReducer]
  )

  const rootReducerMemo = React.useMemo(() => rootReducer, [])

  const reducers = React.useCallback(() => combineReducers(rootReducer), [])

  // call the function to get initial state and global reducer
  const [mainState, mainReducer] = reducers()

  // setup useReducer with the returned value of the reducers function
  const [state, dispatch] = React.useReducer(
    isASingleReducer ? rootReducerMemo : mainReducer,
    initialState || mainState,
    initializer
  )

  // pass in the returned value of useReducer
  const contextValue = React.useMemo(() => ({ state, dispatch }), [
    state,
    dispatch,
  ])

  return (
    <AppStateProvider.Provider value={contextValue}>
      {children}
    </AppStateProvider.Provider>
  )
}

ContextProvider.propTypes = {
  rootReducer: PropTypes.oneOfType([
    PropTypes.objectOf(PropTypes.func.isRequired),
    PropTypes.func,
  ]).isRequired,
  initialState: PropTypes.object.isRequired,
  initializer: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
}

export { ContextProvider, AppStateProvider as ContextConsumer }
