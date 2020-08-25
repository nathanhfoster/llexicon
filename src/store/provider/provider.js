import React, { createContext, useMemo, useReducer, useEffect } from "react"
import PropTypes from "prop-types"
import storeFactory from "../"
import { combineReducers, isQuotaExceeded } from "../utils"

const StateProvider = createContext({})

const defaultInitializer = (state) => state

const store = storeFactory()

// This allows actions to dispatch other actions and pass (dispatch, getState)
const augmentDispatch = (dispatch, state) => (input) => {
  const getState = () => state
  return input instanceof Function || typeof input === "function"
    ? input(dispatch, getState)
    : dispatch(input)
}

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

  const augmentedDispatch = augmentDispatch(dispatch, state)

  // Update store object to potentially access it outside of a component
  if (!store.isReady) {
    store.isReady = true
    store.state = state
    store.dispatch = augmentedDispatch
    Object.freeze(store)
  }

  // persist storage if persistKey exists
  useEffect(() => {
    if (persistKey) {
      let stringifiedState = JSON.stringify(state)
      try {
        localStorage.setItem(persistKey, stringifiedState)
      } catch (e) {
        if (isQuotaExceeded(e)) {
          stringifiedState = JSON.stringify(mainState)
          localStorage.setItem(persistKey, stringifiedState)
        }
      }
    }
  }, [state, persistKey])

  // pass in the returned value of useReducer
  const contextValue = useMemo(() => ({ state, dispatch: augmentedDispatch }), [
    state,
    dispatch,
  ])

  return (
    <StateProvider.Provider value={contextValue}>
      {children}
    </StateProvider.Provider>
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

export { ContextProvider, StateProvider as ContextConsumer, store }
