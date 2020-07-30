import * as React from "react"
import { ContextConsumer } from "./provider"

const bindActionCreator = (actionCreator, dispatch, getState) => {
  function boundAction() {
    try {
      /**
       * If the action returns a function, append => (dispatch, getState) to the orginal function
       *
       * example:
       * const basicTableSetPage = (payload) => (dispatch, getState) => dispatch({ type: "SOME_ACTION_TYPE", payload })
       */
      return actionCreator.apply(this, arguments)(dispatch, getState)
    } catch {
      /**
       * If the action returns an object, wrap it in a dispatch
       *
       * example:
       * const basicTableSetPage = (payload) => ({ type: "SOME_ACTION_TYPE", payload })
       */
      return dispatch(actionCreator.apply(this, arguments))
    } finally {
    }
  }

  return boundAction
}

/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass an action creator as the first argument,
 * and get a dispatch wrapped function in return.
 *
 * @param {Function|Object} actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param {Function} dispatch The `dispatch` function derived from ContextConsumer
 *
 * @param {Function} state The `state` value / object derived from ContextConsumer
 */

const bindActionCreators = (actionCreators, dispatch, getState) => {
  if (typeof actionCreators === "function") {
    return bindActionCreator(actionCreators, dispatch, getState)
  }

  if (typeof actionCreators !== "object" || actionCreators === null) {
    throw new Error(
      `bindActionCreators expected an object or a function, instead received ${
        actionCreators === null ? "null" : typeof actionCreators
      }.`
    )
  }

  let boundActionCreators = {}

  for (const key in actionCreators) {
    const action = actionCreators[key]
    if (typeof action === "function") {
      boundActionCreators[key] = bindActionCreator(action, dispatch, getState)
    }
  }

  return boundActionCreators
}

/**
 * function in charge of combining the factories, props and context to a React.Component
 *
 * @param {factory} mapStateToProps
 * @param {factory} mapDispatchToProps
 * @return {function(React.Component): function(object): *}
 */
const connect = (mapStateToProps, mapDispatchToProps) =>
  /**
   * @param {React.node} Component
   */
  (Component) =>
    /**
     * that returns a function, the 'props' parameter gives use
     * any props that this component may have. If console.log this
     * parameter and you'll see an empty object.
     *
     * We will place all combined props here
     */
    (ownProps) => {
      /**
       * <ContextConsumer.Consumer>
       * {({ state, dispatch }) =>
       * {... return <Component {...combinedComponentProps} />}
       * </ContextConsumer.Consumer>
       * The above approach will not allow us to memoize dispatchToProps
       * This is due to calling mapDispatchToProps(dispatch, getState)
       * This will cause rerenders of the Component
       * To prevent this, we will use the useContext hook which allows us to use other hooks
       * This allows us to memoize our stateToProps and dispatchToProps using the useMemo hook
       */
      const { state, dispatch } = React.useContext(ContextConsumer)

      const getState = React.useCallback(() => state, [state])

      // Memoize globalState
      const stateToProps = mapStateToProps
        ? React.useMemo(() => mapStateToProps(state, ownProps), [state, ownProps])
        : null

      // Memoize globalDispatch
      const dispatchToProps = React.useMemo(
        () =>
          !mapDispatchToProps
            ? null
            : mapDispatchToProps instanceof Function ||
              typeof mapDispatchToProps === "function"
            ? /**
               * pass dispatch and getState to the mapDispatchToProps function
               *
               * example:
               *
               * const mapDispatchToProps = (dispatch, getState) => ({
               * basicTableSort: (onSortCallback, sortKey, sortUp) =>
               * dispatch(basicTableSort(onSortCallback, sortKey, sortUp)),
               *
               * basicTableFilter: (onFilterCallback, filterKey, filterValue) =>
               * dispatch(basicTableFilter(onFilterCallback, filterKey, filterValue)),
               * })
               *
               */
              mapDispatchToProps(dispatch, getState)
            : /**
               * For convenience, append (dispatch, getState) => function to the orginal (arguments) => function
               * Or if the action returns an object, wrap it in a dispatch
               * example: const mapDispatchToProps = { basicTableSort, basicTableFilter }
               *
               */
              bindActionCreators(mapDispatchToProps, dispatch, getState),
        [mapDispatchToProps]
      )

      // Memoize the Component's combined props
      const combinedComponentProps = React.useMemo(
        () => ({
          ...stateToProps,
          ...ownProps,
          // not all components need to dispatch actions so its optional
          ...(mapDispatchToProps && {
            ...dispatchToProps,
          }),
        }),
        [ownProps, stateToProps, dispatchToProps]
      )

      const renderComponent = React.useMemo(
        // Pass all the key value combinedComponentProps to Component
        () => <Component {...combinedComponentProps} />,
        [combinedComponentProps]
      )

      return renderComponent
    }

export default connect
