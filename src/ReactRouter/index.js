import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { withRouter, Route, Switch, Redirect } from "react-router-dom"
import { RouteMap } from "./Routes"
import { OverlayScrollbarsComponent } from "overlayscrollbars-react"
import NavBar from "../components/NavBar"
import Footer from "../components/Footer"
import Home from "../views/Home"
import NewEntry from "../views/NewEntry"
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
import deepEquals from "../helpers/deepEquals"
import "./styles.css"

const getRouteItems = props => {
  const { User } = props
  const {
    HOME,
    ROOT,
    NEW_ENTRY,
    LOGIN,
    SIGNUP,
    PASSWORD_RESET,
    SETTINGS,
    CALENDAR,
    ENTRY_DETAIL,
    ENTRIES,
    ENTRIES_MINIMAL,
    ENTRIES_DETAILED,
    ENTRIES_TABLE,
    ENTRIES_MAP,
    PRIVACY_POLICY
  } = RouteMap

  return [
    { path: [ROOT, HOME], component: Home },
    {
      path: [LOGIN, SIGNUP, PASSWORD_RESET],
      component: renderRedirectOrComponent(props, User.token, NEW_ENTRY, Login)
    },
    {
      path: [SETTINGS],
      component: Settings
    },
    { path: [ENTRY_DETAIL], component: EntryDetail },
    {
      path: [
        NEW_ENTRY,
        CALENDAR,
        ENTRIES,
        ENTRIES_MINIMAL,
        ENTRIES_DETAILED,
        ENTRIES_TABLE,
        ENTRIES_MAP,
        NEW_ENTRY
      ],
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

class ReactRouter extends Component {
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

  shouldComponentUpdate(nextProps, nextState) {
    const currentRouteOverlayHeight = this.state.routeOverlayHeight
    const currentNavBarHeight = this.state.navBarHeight
    const currentFooterHeight = this.state.footerHeight

    const currentUser = this.props.User

    const { routeOverlayHeight, navBarHeight, footerHeight } = nextState

    const { User } = nextProps

    const userChanged = !deepEquals(currentUser, User)

    const stateChanged =
      currentRouteOverlayHeight !== routeOverlayHeight ||
      currentNavBarHeight !== navBarHeight ||
      currentFooterHeight !== footerHeight

    return userChanged || stateChanged
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
      routeOverlayHeight,
      navBarHeight,
      footerHeight
    } = this.state

    return (
      <Fragment>
        <NavBar />
        <OverlayScrollbarsComponent
          className="App routeOverlay os-theme-light"
          style={{
            top: navBarHeight,
            bottom: show_footer ? footerHeight : 0
            // background: "red"
          }}
          options={{
            /* overflowBehavior: {
              x: "visible-hidden",
              y: "visible-hidden"
            }, */
            scrollbars: {
              // visibility: "auto",
              autoHide: "scroll",
              autoHideDelay: 200
              // dragScrolling: false
            }
            // callbacks: {
            //   onScrollStart: () => console.log("Scrolling")
            // }
          }}
        >
          <Switch>
            {this.renderRouteItems(routeItems)}
            <Route component={PageNotFound} />
          </Switch>
          <Footer />
        </OverlayScrollbarsComponent>
      </Fragment>
    )
  }
}
export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(ReactRouter)
)
