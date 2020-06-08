import * as React from "react"
import PropTypes from "prop-types"

import { combineReducers } from "../utils"

const AppStateProvider = React.createContext({})

const defaultInitializer = (state) => state

const ContextProvider = ({
  rootReducer,
  initialState,
  initializer,
  persistKey,
  children,
}) => {
  const reducers = React.useCallback(
    () => combineReducers(rootReducer, initialState),
    []
  )

  // call the function to get initial state and global reducer
  const [mainState, mainReducer] = reducers()

  // setup useReducer with the returned value of the reducers function
  const [state, dispatch] = React.useReducer(
    mainReducer,
    mainState,
    initializer
  )

  React.useEffect(() => {
    if (persistKey) {
      localStorage.setItem(persistKey, JSON.stringify(state))
    }
  }, [state])

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
  initialState: PropTypes.object,
  initializer: PropTypes.func,
  persistKey: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
}

ContextProvider.defaultProps = {
  initializer: defaultInitializer,
}

export { ContextProvider, AppStateProvider as ContextConsumer }
