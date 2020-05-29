import * as React from "react"
import { ContextConsumer } from "./provider"

const bindActionCreator = (actionCreator, dispatch, state) => {
  function boundAction() {
    return actionCreator(...arguments)(dispatch, state)
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

const bindActionCreators = (actionCreators, dispatch, state) => {
  if (typeof actionCreators === "function") {
    return bindActionCreator(actionCreators, dispatch, state)
  }

  if (typeof actionCreators !== "object" || actionCreators === null) {
    throw new Error(
      `bindActionCreators expected an object or a function, instead received ${
        actionCreators === null ? "null" : typeof actionCreators
      }. ` +
        `Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?`
    )
  }

  const boundActionCreators = {}
  for (const key in actionCreators) {
    const actionCreator = actionCreators[key]
    if (typeof actionCreator === "function") {
      boundActionCreators[key] = bindActionCreator(
        actionCreator,
        dispatch,
        state
      )
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
    (props) => {
      /**
       * <ContextConsumer.Consumer>
       * {({ state, dispatch }) =>
       * {... return <Component {...combinedComponentProps} />}
       * </ContextConsumer.Consumer>
       * The above approach will not allow us to memoize dispatchToProps
       * This is due to calling mapDispatchToProps(dispatch, state)
       * This will cause rerenders of the Component
       * To prevent this, we will use the useContext hook which allows us to use other hooks
       * This allows us to memoize our stateToProps and dispatchToProps using the useMemo hook
       */
      const { state, dispatch } = React.useContext(ContextConsumer)

      // Memoize globalState
      const stateToProps = React.useMemo(() => mapStateToProps(state), [state])

      // Memoize globalDispatch
      const dispatchToProps = React.useMemo(
        () =>
          !mapDispatchToProps
            ? null
            : mapDispatchToProps instanceof Function ||
              typeof mapDispatchToProps === "function"
            ? /**
               * pass dispatch and state to the mapDispatchToProps function
               *
               * example:
               *
               * const mapDispatchToProps = (dispatch, state) => ({
               * basicTableSort: (onSortCallback, sortKey, sortUp) =>
               * dispatch(basicTableSort(onSortCallback, sortKey, sortUp)),
               *
               * basicTableFilter: (onFilterCallback, filterKey, filterValue) =>
               * dispatch(basicTableFilter(onFilterCallback, filterKey, filterValue)),
               * })
               *
               */
              mapDispatchToProps(dispatch, state)
            : /**
               * For convenience, append (dispatch, state) => function to the orginal (arguments) => function
               *
               * example:
               *
               * example: const mapDispatchToProps = { basicTableSort, basicTableFilter }
               */
              bindActionCreators(mapDispatchToProps, dispatch, state),
        [mapDispatchToProps]
      )

      // Memoize the Component's combined props
      const combinedComponentProps = React.useMemo(
        () => ({
          ...stateToProps,
          ...props,
          // not all components need to dispatch actions so its optional
          ...(mapDispatchToProps && {
            ...dispatchToProps,
          }),
        }),
        [stateToProps, props, dispatchToProps]
      )

      // Pass all the key value combinedComponentProps to Component
      return <Component {...combinedComponentProps} />
    }

export default connect
