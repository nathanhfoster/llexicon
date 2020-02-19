import React, { useMemo, memo } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { useHistory, Route, Switch, Redirect } from "react-router-dom"
import { RouteMap } from "./Routes"
import {
  Home,
  Settings,
  Support,
  EntryDetail,
  Entries,
  Login,
  PageNotFound
} from "../../views"
import { PrivacyPolicy } from "../"
import { RouterLinkPush } from "./Routes"
import memoizeProps from "../../helpers/memoizeProps"
import "./styles.css"

const {
  HOME,
  ROOT,
  NEW_ENTRY,
  LOGIN,
  SIGNUP,
  PASSWORD_RESET,
  SETTINGS,
  SUPPORT,
  CALENDAR,
  ENTRY_DETAIL,
  ENTRIES,
  ENTRIES_MINIMAL,
  ENTRIES_CARDS,
  ENTRIES_DETAILED,
  ENTRIES_TABLE,
  ENTRIES_MAP,
  PRIVACY_POLICY
} = RouteMap

const mapStateToProps = ({ User, Window: { navBarHeight } }) => ({
  User,
  navBarHeight
})

const ReactRouter = props => {
  const history = useHistory()
  const { User, navBarHeight } = props

  const renderRedirectOrComponent = (shouldRedirect, route, Component) => {
    return shouldRedirect
      ? () => <Redirect push to={RouterLinkPush(history, route)} />
      : Component
  }

  const routeItems = [
    { path: [ROOT, HOME], component: Home },
    {
      path: [LOGIN, SIGNUP, PASSWORD_RESET],
      component: renderRedirectOrComponent(User.token, NEW_ENTRY, Login)
    },
    {
      path: [SETTINGS],
      component: Settings
    },
    {
      path: [SUPPORT],
      component: Support
    },
    { path: [ENTRY_DETAIL], component: EntryDetail },
    {
      path: [
        ENTRIES,
        NEW_ENTRY,
        CALENDAR,
        ENTRIES_CARDS,
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

  const renderRouteItems = useMemo(
    () =>
      routeItems.map((item, i) => {
        const { path, component } = item
        return <Route exact key={i} path={path} component={component} />
      }),
    [routeItems]
  )

  return (
    <div
      className="App routeOverlay"
      style={{
        top: navBarHeight,
        bottom: 0
        // background: "red"
      }}
    >
      <Switch>
        {renderRouteItems}
        <Route component={PageNotFound} />
      </Switch>
    </div>
  )
}

ReactRouter.propTypes = {
  User: PropTypes.objectOf(PropTypes.any),
  navBarHeight: PropTypes.number.isRequired
}

const isEqual = (prevProps, nextProps) =>
  memoizeProps(prevProps, nextProps, [
    "User",
    "routeOverlayHeight",
    "navBarHeight"
  ])

export default reduxConnect(mapStateToProps)(memo(ReactRouter, isEqual))
