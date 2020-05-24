import * as React from "react"
import { combineReducers } from "../utils"

const defaultInitializer = (state) => state

const useProviderReducer = (
  rootReducer,
  initialState,
  initializer = defaultInitializer
) => {
  const reducers = React.useCallback(() => combineReducers(rootReducer), [])

  // call the function to get initial state and global reducer
  const [mainState, mainReducer] = reducers()

  // setup useReducer with the returned value of the reducers function
  const [state, dispatch] = React.useReducer(
    mainReducer,
    initialState || mainState,
    initializer
  )

  // pass in the returned value of useReducer
  const contextValue = React.useMemo(() => ({ state, dispatch }), [
    state,
    dispatch,
  ])

  return contextValue
}

export { defaultInitializer, useProviderReducer }
