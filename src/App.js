import React, { useEffect, useMemo, lazy, memo, Fragment } from "react"
import PropTypes from "prop-types"
import { UserProps } from "./redux/User/propTypes"
import { connect as reduxConnect } from "react-redux"
import { withRouter, Route, Switch, Redirect } from "react-router-dom"
import { Fade } from "reactstrap"
import { SetWindow, CheckAppVersion } from "./redux/App/actions"
import { GetUserSettings } from "./redux/User/actions"
import { SetCalendar } from "./redux/Calendar/Calendar"
import {
  SyncEntries,
  GetUserEntries,
  GetUserEntryTags
} from "./redux/Entries/actions"
import { RouteMap } from "./routes"
import { Home, Entries } from "./views"
import { NavBar, PrivacyPolicy } from "./components"
import { RouterLinkPush } from "./routes"
import memoizeProps from "./helpers/memoizeProps"
import { useAddToHomescreenPrompt } from "./components/AddToHomeScreen/prompt"

const Account = lazy(() => import("./views/Account"))
const Settings = lazy(() => import("./views/Settings"))
const Support = lazy(() => import("./views/Support"))
const EntryDetail = lazy(() => import("./views/EntryDetail"))
const PageNotFound = lazy(() => import("./views/PageNotFound"))

const FIFTEEN_MINUTES = 1000 * 60 * 15

const {
  HOME,
  ROOT,
  NEW_ENTRY,
  LOGIN,
  SIGNUP,
  PASSWORD_RESET,
  SETTINGS,
  SETTINGS_ENTRIES,
  SETTINGS_PREFERENCES,
  SETTINGS_PROFILE,
  SUPPORT,
  CALENDAR,
  ENTRY_DETAIL,
  ENTRIES,
  ENTRIES_MINIMAL,
  ENTRIES_FOLDERS,
  ENTRIES_DETAILED,
  ENTRIES_TABLE,
  ENTRIES_MAP,
  PRIVACY_POLICY
} = RouteMap

const mapStateToProps = ({ User, Window: { navBarHeight } }) => ({
  User,
  navBarHeight
})

const mapDispatchToProps = {
  SetWindow,
  GetUserSettings,
  CheckAppVersion,
  SetCalendar,
  SyncEntries,
  GetUserEntries,
  GetUserEntryTags
}

const App = ({
  GetUserSettings,
  User,
  CheckAppVersion,
  SetWindow,
  SetCalendar,
  SyncEntries,
  GetUserEntries,
  GetUserEntryTags,
  history,
  location,
  match,
  navBarHeight
}) => {
  const [prompt, promptToInstall] = useAddToHomescreenPrompt()
  useEffect(() => {
    const activeDate = new Date()

    SetCalendar({ activeDate })

    CheckAppVersion()

    setInterval(() => CheckAppVersion(), FIFTEEN_MINUTES)

    const handleResize = () => SetWindow()

    window.addEventListener("resize", handleResize)

    handleResize()

    if (User.id) {
      SyncEntries(() => new Promise(resolve => resolve(GetUserEntries(1))))
      GetUserSettings()
      GetUserEntryTags()
    }

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const renderRedirectOrComponent = (shouldRedirect, route, component) => {
    return shouldRedirect
      ? () => <Redirect push to={RouterLinkPush(history, route)} />
      : component
  }

  const routeItems = [
    {
      path: [ROOT, HOME],
      Render: Home,
      renderProps: { prompt, promptToInstall },
      useRouteProps: true
    },
    {
      path: [LOGIN, SIGNUP, PASSWORD_RESET],
      component: renderRedirectOrComponent(User.token, NEW_ENTRY, Account)
    },
    {
      path: [
        SETTINGS,
        SETTINGS_ENTRIES,
        SETTINGS_PREFERENCES,
        SETTINGS_PROFILE
      ],
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
        ENTRIES_FOLDERS,
        ENTRIES_MINIMAL,
        ENTRIES_DETAILED,
        ENTRIES_TABLE,
        ENTRIES_MAP,
        NEW_ENTRY
      ],
      Render: Entries,
      useRouteProps: true
    },
    { path: [PRIVACY_POLICY], component: PrivacyPolicy }
  ]

  const renderRouteItems = useMemo(
    () =>
      routeItems.map((item, i) => {
        const { path, component, Render, renderProps, useRouteProps } = item
        return Render ? (
          <Route
            exact={true}
            strict={false}
            key={i}
            path={path}
            render={routeProps =>
              useRouteProps ? (
                <Render {...renderProps} {...routeProps} />
              ) : (
                <Render {...renderProps} />
              )
            }
          />
        ) : (
          <Route exact key={i} path={path} component={component} />
        )
      }),
    [routeItems]
  )

  return (
    <Fragment>
      <NavBar />
      <div className="App RouteOverlay">
        <Switch>
          {renderRouteItems}
          <Route component={PageNotFound} />
        </Switch>
      </div>
    </Fragment>
  )
}

App.propTypes = {
  User: UserProps,
  navBarHeight: PropTypes.number.isRequired,
  SetWindow: PropTypes.func.isRequired,
  GetUserSettings: PropTypes.func.isRequired,
  SetCalendar: PropTypes.func.isRequired,
  SyncEntries: PropTypes.func.isRequired,
  GetUserEntries: PropTypes.func.isRequired
}

const isEqual = (prevProps, nextProps) =>
  memoizeProps(prevProps, nextProps, [
    "User",
    "routeOverlayHeight",
    "navBarHeight"
  ])

export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(memo(App, isEqual))
)
