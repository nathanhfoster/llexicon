import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { withRouter, Route, Switch, Redirect } from "react-router-dom"
import { RouteMap } from "../ReactRouter/routes"
import Settings from "../views/Settings"
import Home from "../views/Home"
import AddEntry from "../views/AddEntry"
import Entries from "../views/Entries"
import Login from "../views/Login"
import PrivacyPolicy from "../components/PrivacyPolicy"
import PageNotFound from "../views/PageNotFound"
import { GetUserSettings } from "../actions/Settings"
import { RouterLinkPush } from "../helpers/routing"
import "./styles.css"

const mapStateToProps = ({ User }) => ({ User })

const mapDispatchToProps = {}

class ReactRouter extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = { User: PropTypes.objectOf(PropTypes.any) }

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
    const routeItems = this.getRouteItems(props)
    this.setState({ routeItems })
  }

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  renderRedirectOrComponent = (shouldRedirect, route, Component) => {
    const { history } = this.props
    return shouldRedirect
      ? () => <Redirect push to={RouterLinkPush(history, route)} />
      : Component
  }

  getRouteItems = props => {
    const { User, history } = props
    const { state } = history.location
    return [
      {
        path: [RouteMap.SETTINGS],
        component: this.renderRedirectOrComponent(
          !User.token,
          RouteMap.HOME,
          Settings
        )
      },
      { path: [RouteMap.HOME], component: Home },
      { path: [RouteMap.HOME, RouteMap.ENTRY_ADD], component: AddEntry },
      {
        path: [RouteMap.ENTRIES],
        component: this.renderRedirectOrComponent(
          !User.token,
          RouteMap.LOGIN,
          Entries
        )
      },
      { path: [RouteMap.PRIVACY_POLICY], component: PrivacyPolicy },
      {
        path: [RouteMap.LOGIN],
        component: this.renderRedirectOrComponent(
          User.token,
          RouteMap.HOME,
          Login
        )
      }
    ]
  }

  renderRouteItems = routeItems =>
    routeItems.map((k, i) => {
      const { path, component } = k
      return <Route exact key={i} path={path} component={component} />
    })

  render() {
    const { routeItems } = this.state
    return (
      <div className="routeOverlay" style={{ bottom: 0 }}>
        <Switch>
          {this.renderRouteItems(routeItems)}
          <Route component={PageNotFound} />
        </Switch>
      </div>
    )
  }
}
export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(ReactRouter)
)
