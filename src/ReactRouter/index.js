import React, { PureComponent, lazy } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { withRouter, Route, Switch, Redirect } from "react-router-dom"
import { Container, Row, Col } from "reactstrap"
import { RouteMap } from "./Routes"
import NavBar from "../components/NavBar"
import Footer from "../components/Footer"
import Home from "../views/Home"
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
    screen: { availHeight }
  }
}) => ({
  User,
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
      viewPortHeight
    } = props
    const routeItems = this.getRouteItems(props)

    const routeOverlayHeight = `calc(${viewPortHeight}px - var(--navBarHeight))`

    this.setState({
      routeItems,
      routeOverlayHeight,
      Settings
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
    const { state } = history.location
    const {
      ROOT,
      HOME,
      LOGIN,
      ENTRY_ADD,
      SETTINGS,
      CALENDAR,
      ENTRIES,
      PRIVACY_POLICY
    } = RouteMap

    return [
      { path: [ROOT, HOME], component: Home },
      { path: [HOME, ENTRY_ADD], component: AddEntry },
      {
        path: [LOGIN],
        component: this.renderRedirectOrComponent(User.token, HOME, Login)
      },
      {
        path: [SETTINGS],
        component: this.renderRedirectOrComponent(!User.token, HOME, Settings)
      },
      { path: [CALENDAR], component: Calendar },
      {
        path: [ENTRIES, HOME],
        component: Entries
      },
      { path: [PRIVACY_POLICY], component: PrivacyPolicy }
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
      routeOverlayHeight
    } = this.state

    return (
      <div
        className="App routeOverlay"
        style={{
          top: "var(--navBarHeight)",
          bottom: show_footer ? "var(--footerHeight)" : 0
          // background: "red"
        }}
      >
        <NavBar />
        <Switch>
          {this.renderRouteItems(routeItems)}
          <Route component={PageNotFound} />
        </Switch>
        <Footer />
      </div>
    )
  }
}
export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(ReactRouter)
)
