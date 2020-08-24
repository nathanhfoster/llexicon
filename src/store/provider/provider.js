import React, { createContext, useMemo, useReducer, useEffect } from "react"
import PropTypes from "prop-types"
import storeFactory from "../"

import { combineReducers } from "../utils"

const AppStateProvider = createContext({})

const defaultInitializer = (state) => state

const store = storeFactory()

const ContextProvider = ({
  rootReducer,
  initialState,
  initializer,
  persistKey,
  children,
}) => {
  // call the function to get initial state and global reducer
  const [mainState, mainReducer] = useMemo(
    () => combineReducers(rootReducer, initialState),
    []
  )

  // setup useReducer with the returned values of the combineReducers
  const [state, dispatch] = useReducer(mainReducer, mainState, initializer)

  // Update store object to potentially access it outside of a component
  if (!store.isReady) {
    store.isReady = true
    store.state = state
    store.dispatch = (params) => dispatch(params)
    Object.freeze(store)
  }

  // persist storage if persistKey exists
  useEffect(() => {
    if (persistKey) {
      localStorage.setItem(persistKey, JSON.stringify(state))
    }
  }, [state, persistKey])

  // pass in the returned value of useReducer
  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch])

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

export { ContextProvider, AppStateProvider as ContextConsumer, store }
