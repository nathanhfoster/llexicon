import { isAFunction } from "./"

const combineReducers = (reducers, initialState = {}) => {
  // If a single reducer
  if (isAFunction(reducers)) {
    return [initialState, reducers]
  }

  // set default state returned by reducer and its reducer
  const globalState = Object.entries(reducers).reduce(
    (state, [key, reducer]) => {
      if (isAFunction(reducer)) {
        state[key] = reducer(undefined, { type: "__@@PLACEHOLDER_ACTION__" })
      } else {
        console.error(`${reducer} is not a function`)
      }

      return state
    },
    {}
  )

  /**
   * Global reducer function; this is passed to the useReducer hook
   *
   * @param {object} state
   * @param {object} action
   */
  const reducerFunction = (state, action) => {
    let hasStateChanged = false
    const updatedStateByReducers = {}

    /**
     * this is where dispatching happens;
     * the action is passed to all reducers one by one.
     * we iterate and pass the action to each reducer and this would return new
     * state if applicable.
     */
    for (const reducer in reducers) {
      if (reducers.hasOwnProperty(reducer)) {
        const currentStateByKey = state[reducer]
        const currentReducer = reducers[reducer]

        const returnedStateByReducer = currentReducer(currentStateByKey, action)

        const areStateByKeyEqual = returnedStateByReducer !== currentStateByKey

        hasStateChanged = hasStateChanged || areStateByKeyEqual

        updatedStateByReducers[reducer] = returnedStateByReducer
      }
    }
    return hasStateChanged ? updatedStateByReducers : state
  }

  // return the initial state and the global reducer
  return [globalState, reducerFunction]
}

export { combineReducers }
