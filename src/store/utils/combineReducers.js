const combineReducers = (reducers) => {
  const globalState = {}

  // set default state returned by reducer and its reducer
  for (const [key, value] of Object.entries(reducers)) {
    if (value instanceof Function || typeof value === "function") {
      globalState[key] = value(undefined, { type: "__@@PLACEHOLDER_ACTION__" })
    } else {
      console.error(`${value} is not a function`)
    }
  }

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

        console.log(hasStateChanged, areStateByKeyEqual)

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
