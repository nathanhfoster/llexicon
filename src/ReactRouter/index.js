import React, { PureComponent, Fragment } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { withRouter, Route, Switch, Redirect } from "react-router-dom"
import { RouteMap } from "./Routes"
import NavBar from "../components/NavBar"
import Footer from "../components/Footer"
import Home from "../views/Home"
import Settings from "../views/Settings"
import DiaryCalendar from "../views/DiaryCalendar"
import EntryDetail from "../views/EntryDetail"
import Entries from "../views/Entries"
import Login from "../views/Login"
import PrivacyPolicy from "../components/PrivacyPolicy"
import PageNotFound from "../views/PageNotFound"
import { GetUserSettings } from "../actions/Settings"
import { RouterLinkPush } from "./Routes"
import { getRandomInt } from "../helpers"
import "./styles.css"

const getRouteItems = props => {
  const { User, history } = props
  const { state } = history.location
  const {
    ROOT,
    HOME,
    LOGIN,
    SIGNUP,
    ENTRY_ADD,
    SETTINGS,
    CALENDAR,
    ENTRY_DETAIL,
    ENTRIES,
    PRIVACY_POLICY
  } = RouteMap

  return [
    { path: [ROOT, HOME, ENTRY_ADD], component: Home },
    {
      path: [LOGIN, SIGNUP],
      component: renderRedirectOrComponent(props, User.token, HOME, Login)
    },
    {
      path: [SETTINGS],
      component: Settings
    },
    { path: [CALENDAR], component: DiaryCalendar },
    { path: [ENTRY_DETAIL], component: EntryDetail },
    {
      path: [ENTRIES, HOME],
      component: Entries
    },
    { path: [PRIVACY_POLICY], component: PrivacyPolicy }
  ]
}

const renderRedirectOrComponent = (props, shouldRedirect, route, Component) => {
  const { history } = props
  return shouldRedirect
    ? () => <Redirect push to={RouterLinkPush(history, route)} />
    : Component
}

const mapStateToProps = ({
  User,
  Window: {
    screen: { availHeight },
    navBarHeight,
    footerHeight
  }
}) => ({
  User,
  viewPortHeight: availHeight,
  navBarHeight,
  footerHeight
})

const mapDispatchToProps = {}

class ReactRouter extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = { User: PropTypes.objectOf(PropTypes.any) }

  static defaultProps = {}

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      User: { Settings },
      viewPortHeight,
      navBarHeight,
      footerHeight
    } = nextProps

    const routeItems = getRouteItems(nextProps)

    const routeOverlayHeight = viewPortHeight - navBarHeight

    return {
      routeItems,
      routeOverlayHeight,
      navBarHeight,
      footerHeight,
      Settings
    }
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  renderRouteItems = routeItems =>
    routeItems.map((k, i) => {
      const { path, component } = k
      return <Route exact key={i} path={path} component={component} />
    })

  render() {
    const {
      routeItems,
      Settings: { show_footer },
      routeOverlayHeight,
      navBarHeight,
      footerHeight
    } = this.state

    return (
      <Fragment>
        <NavBar />
        <div
          className="App routeOverlay"
          style={{
            top: navBarHeight,
            bottom: show_footer ? footerHeight : 0
            // background: "red"
          }}
        >
          <Switch>
            {this.renderRouteItems(routeItems)}
            <Route component={PageNotFound} />
          </Switch>
          <Footer />
        </div>
      </Fragment>
    )
  }
}
export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(ReactRouter)
)
