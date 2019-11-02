import React, { PureComponent, lazy } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { withRouter, Route, Switch, Redirect } from "react-router-dom"
import { RouteMap } from "./Routes"
import Settings from "../views/Settings"
import AddEntry from "../views/AddEntry"
import Calendar from "../views/Calendar"
import Entries from "../views/Entries"
import Login from "../views/Login"
import PrivacyPolicy from "../components/PrivacyPolicy"
import PageNotFound from "../views/PageNotFound"
import { GetUserSettings } from "../actions/Settings"
import { RouterLinkPush } from "../helpers/routing"
import { getRandomInt } from "../helpers"
import "./styles.css"

const mapStateToProps = ({
  User,
  Window: {
    navbarHeight,
    footerHeight,
    screen: { availHeight }
  }
}) => ({
  User,
  navbarHeight,
  footerHeight,
  viewPortHeight: availHeight
})

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
    const {
      User: { Settings },
      navbarHeight,
      footerHeight,
      viewPortHeight
    } = props
    const routeItems = this.getRouteItems(props)

    const routeOverlayHeight = `calc(${viewPortHeight}px - ${navbarHeight})`

    this.setState({
      routeItems,
      Settings,
      navbarHeight,
      footerHeight,
      routeOverlayHeight
    })
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

    const Home = lazy(() => {
      let min = 0
      let max = 700
      return new Promise(resolve => {
        if (User.id) {
          min = 0
          max = 100
        }
        return setTimeout(resolve, getRandomInt(min, max))
      }).then(
        () =>
          // Math.floor(Math.random() * 10) >= 4 ?
          import("../views/Home")
        // : Promise.reject(new Error())
      )
    })

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
      { path: [RouteMap.CALENDAR], component: Calendar },
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
    const {
      routeItems,
      Settings: { show_footer },
      navbarHeight,
      footerHeight,
      routeOverlayHeight
    } = this.state

    return (
      <div
        className="routeOverlay"
        style={{
          height: routeOverlayHeight,
          top: navbarHeight,
          bottom: show_footer ? footerHeight : 0
        }}
      >
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
