import React, { PureComponent, lazy } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { Route, Redirect } from "react-router-dom"
import { RouterPush, RouterLinkPush } from "../../helpers/routing"
import { RouteMap } from "."
import { getRandomInt } from "../../helpers"

const mapStateToProps = ({ User }) => ({ UserId: User.id })

const mapDispatchToProps = {}

class HomeRoute extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {}

  static defaultProps = {}

  componentWillMount() {
    this.getState(this.props)
  }

  componentWillUpdate(nextProps, nextState) {}

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const { UserId } = props

    const path = [RouteMap.HOME]

    const component = lazy(() => {
      let min = 700
      let max = 1400
      return new Promise(resolve => {
        if (UserId) {
          min = 0
          max = 100
        }
        return setTimeout(resolve, getRandomInt(min, max))
      }).then(
        () =>
          // Math.floor(Math.random() * 10) >= 4 ?
          import("../../views/Home")
        // : Promise.reject(new Error())
      )
    })

    this.setState({ path, component })
  }

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  renderRedirectOrComponent = (shouldRedirect, route, Component) => {
    const { history } = this.props
    return shouldRedirect
      ? () => <Redirect push to={RouterLinkPush(history, route)} />
      : Component
  }

  render() {
    const { path, component } = this.state
    return <Route exact path={path} component={component} />
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(HomeRoute)
