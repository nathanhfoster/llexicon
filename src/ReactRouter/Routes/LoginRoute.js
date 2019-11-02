import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { Route, Redirect, withRouter } from "react-router-dom"
import { RouterPush, RouterLinkPush } from "../../helpers/routing"
import { RouteMap } from "."
import Login from "../../views/Login"

const mapStateToProps = ({ User }) => ({ UserToken: User.token })

const mapDispatchToProps = {}

class LoginRoute extends PureComponent {
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
    const { UserToken } = props

    const path = [RouteMap.LOGIN]

    const component = this.renderRedirectOrComponent(
      UserToken,
      RouteMap.HOME,
      Login
    )

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
export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(LoginRoute)
)
