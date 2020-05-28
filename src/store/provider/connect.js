import * as React from "react"
import { ContextConsumer } from "./provider"

// ƒ () {
//   return dispatch(actionCreator.apply(this, arguments));
// }

const thunk = (extraArgument) => {
  return ({ dispatch, getState }) => (next) => (action) => {
    if (typeof action === "function") {
      return action(dispatch, getState, extraArgument)
    }

    return next(action)
  }
}

const compose = (...funcs) => {
  if (funcs.length === 0) {
    return (arg) => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

const applyMiddleware = (...middlewares) => {
  return (createStore) => (...args) => {
    const store = createStore(...args)
    let dispatch = () => {
      throw new Error(
        "Dispatching while constructing your middleware is not allowed. " +
          "Other middleware would not be applied to this dispatch."
      )
    }

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args),
    }
    const chain = middlewares.map((middleware) => middleware(middlewareAPI))
    dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch,
    }
  }
}

const bindActionCreator = (actionCreator, dispatch) =>
  dispatch(actionCreator.apply(this, arguments))

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
 * @param {Function} dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns {Function|Object} The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 */
const bindActionCreators = (actionCreators, dispatch) => {
  if (typeof actionCreators === "function") {
    return bindActionCreator(actionCreators, dispatch)
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
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch)
    }
  }
  return boundActionCreators
}

const wrapDispatchAndState = (mapDispatchToProps, dispatch, state) => {
  console.log(mapDispatchToProps)
  return Object.keys(mapDispatchToProps).reduce((dispatchToProps, key) => {
    const propAction = dispatchToProps[key]
    console.log(propAction)
    // console.log(propAction)
    // if (propAction instanceof Function || typeof propAction === "function") {
    //   dispatchToProps[key] = (...args) => {
    //     console.log(args)
    //     return propAction((dispatch, state))
    //   }
    // }
    return dispatchToProps
  }, mapDispatchToProps)
}

/**
 * function in charge of combining the factories, props and context to a React.Component
 *
 * @param {factory} mapStateToProps
 * @param {factory} mapDispatchToProps
 * @return {function(React.Component): function(object): *}
 */
const connect = (mapStateToProps, mapDispatchToProps) => {
  /**
   * @param {React.node} Component
   */
  return (Component) => {
    /**
     * that returns a function, the 'props' parameter gives use
     * any props that this component may have. If console.log this
     * parameter and you'll see an empty object.
     *
     * We will place all combined props here
     */
    return (props) => {
      return (
        <ContextConsumer.Consumer>
          {({ state, dispatch }) => {
            const stateToProps = mapStateToProps(state)

            const dispatchToProps = !mapDispatchToProps
              ? null
              : mapDispatchToProps instanceof Function ||
                typeof mapDispatchToProps === "function"
              ? // the dispatch provided by the consumer; our global reducer
                mapDispatchToProps(dispatch, state)
              : // wrap the dispatch and state
                wrapDispatchAndState(mapDispatchToProps, dispatch, state)

            const componentProps = {
              ...stateToProps,
              ...props,
              // not all components need to dispatch actions so its optional
              ...(mapDispatchToProps && {
                ...dispatchToProps,
              }),
            }

            return <Component {...componentProps} />
          }}
        </ContextConsumer.Consumer>
      )
    }
  }
}

export default React.memo(connect)
