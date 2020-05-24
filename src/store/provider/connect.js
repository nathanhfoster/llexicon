import * as React from "react"
import { ContextConsumer } from "./provider"

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
          {(value) => {
            const stateToProps = mapStateToProps(value.state)

            const dispatchToProps = mapDispatchToProps
              ? // the dispatch provided by the consumer; our global reducer
                mapDispatchToProps(value.dispatch)
              : null

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

export default connect
