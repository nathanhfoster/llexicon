import React, { useEffect, lazy, memo, Fragment } from "react"
import PropTypes from "prop-types"
import { UserProps } from "./redux/User/propTypes"
import { connect as reduxConnect } from "react-redux"
import { Route, Switch, Redirect } from "react-router-dom"
import { SetLocalStorageUsage } from "./redux/App/actions"
import { SetWindow } from "./redux/Window/actions"
import { GetUserSettings } from "./redux/User/actions"
import { SetCalendar } from "./redux/Calendar/actions"
import {
  SyncEntries,
  GetUserEntries,
  GetUserEntryTags,
  GetUserEntryPeople,
  GetUserEntriesByDate,
  ResetEntriesSortAndFilterMaps,
} from "./redux/Entries/actions"
import { ResetMap } from "./redux/Map/actions"
import { RouteMap, RouterGoBack } from "./redux/router/actions"
import { About, Home, Entries, PrivacyPolicy } from "./views"
import { NavBar } from "./components"
import { RouterLinkPush } from "./redux/router/actions"
import memoizeProps from "./utils/memoizeProps"
import { useAddToHomescreenPrompt } from "./components/AddToHomeScreen/prompt"

const Account = lazy(() => import("./views/Account"))
const BackgroundImage = lazy(() => import("./components/BackgroundImage"))
const Settings = lazy(() => import("./views/Settings"))
const Support = lazy(() => import("./views/Support"))
const EntryDetail = lazy(() => import("./views/EntryDetail"))
const PageNotFound = lazy(() => import("./views/PageNotFound"))

const {
  ABOUT,
  HOME,
  ROOT,
  NEW_ENTRY,
  LOGIN,
  SIGNUP,
  PASSWORD_RESET,
  SETTINGS,
  SETTINGS_ENTRIES,
  SETTINGS_PREFERENCES,
  SETTINGS_PUSH_NOTIFICATIONS,
  SETTINGS_STORAGE,
  SETTINGS_PROFILE,
  SUPPORT,
  ENTRIES_CALENDAR,
  ENTRY_DETAIL,
  ENTRIES,
  ENTRIES_LIST,
  ENTRIES_FOLDERS,
  ENTRIES_TABLE,
  ENTRIES_MAP,
  PRIVACY_POLICY,
} = RouteMap

const mapStateToProps = ({ User }) => ({
  userId: User.id,
  userToken: User.token,
})

const mapDispatchToProps = {
  SetWindow,
  SetLocalStorageUsage,
  GetUserSettings,
  SetCalendar,
  SyncEntries,
  GetUserEntries,
  GetUserEntryTags,
  GetUserEntryPeople,
  GetUserEntriesByDate,
  ResetEntriesSortAndFilterMaps,
  ResetMap,
}

const App = ({
  GetUserSettings,
  userId,
  userToken,
  SetWindow,
  SetLocalStorageUsage,
  SetCalendar,
  SyncEntries,
  GetUserEntries,
  GetUserEntryTags,
  GetUserEntryPeople,
  GetUserEntriesByDate,
  ResetEntriesSortAndFilterMaps,
  ResetMap,
}) => {
  const [prompt, promptToInstall] = useAddToHomescreenPrompt()
  const handleResize = () => SetWindow()
  useEffect(() => {
    const activeDate = new Date()

    SetCalendar({ activeDate })
    ResetEntriesSortAndFilterMaps()
    ResetMap()

    SetLocalStorageUsage()

    window.addEventListener("resize", handleResize)

    handleResize()

    if (userId) {
      SyncEntries(() => new Promise((resolve) => resolve(GetUserEntries(1))))
      GetUserSettings()
      GetUserEntryTags()
      GetUserEntryPeople()
      const now = new Date()
      const payload = { month: now.getMonth(), day: now.getDay() }
      GetUserEntriesByDate(payload)
    }

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const renderRedirectOrComponent = (shouldRedirect, component, route) => {
    if (shouldRedirect && route === "GoBack") return () => RouterGoBack(true)
    const directTo = () => RouterLinkPush(route)
    return shouldRedirect ? () => <Redirect push to={directTo} /> : component
  }

  return (
    <Fragment>
      <NavBar prompt={prompt} promptToInstall={promptToInstall} />
      <main className="App RouteOverlay">
        <BackgroundImage />
        <Switch>
          <Route
            exact={true}
            strict={false}
            path={[ABOUT]}
            render={() => (
              <About prompt={prompt} promptToInstall={promptToInstall} />
            )}
          />
          <Route
            exact={true}
            strict={false}
            path={[ROOT, HOME]}
            render={() => (
              <Home prompt={prompt} promptToInstall={promptToInstall} />
            )}
          />
          {/* <Route
            path={ROOT}
            render={() => <Redirect to={HOME} />}
            exact={true}
          /> */}
          <Route
            exact
            path={[LOGIN, SIGNUP, PASSWORD_RESET]}
            component={renderRedirectOrComponent(
              !!userToken,
              Account,
              "GoBack"
            )}
          />
          <Route
            exact
            path={[
              SETTINGS,
              SETTINGS_ENTRIES,
              SETTINGS_PREFERENCES,
              SETTINGS_PROFILE,
              SETTINGS_PUSH_NOTIFICATIONS,
              SETTINGS_STORAGE,
            ]}
            render={() => <Settings />}
          />
          <Route exact path={[SUPPORT]} render={() => <Support />} />
          <Route
            exact={true}
            strict={false}
            path={[ENTRY_DETAIL]}
            render={() => <EntryDetail />}
          />
          <Route
            exact={true}
            strict={false}
            path={[
              ENTRIES,
              NEW_ENTRY,
              ENTRIES_CALENDAR,
              ENTRIES_FOLDERS,
              ENTRIES_LIST,
              ENTRIES_TABLE,
              ENTRIES_MAP,
              NEW_ENTRY,
            ]}
            render={() => <Entries />}
          />
          <Route
            exact
            path={[PRIVACY_POLICY]}
            render={() => <PrivacyPolicy />}
          />
          <Route render={() => <PageNotFound />} />
        </Switch>
      </main>
    </Fragment>
  )
}

App.propTypes = {
  User: UserProps,
  SetWindow: PropTypes.func.isRequired,
  SetLocalStorageUsage: PropTypes.func.isRequired,
  GetUserSettings: PropTypes.func.isRequired,
  SetCalendar: PropTypes.func.isRequired,
  SyncEntries: PropTypes.func.isRequired,
  GetUserEntries: PropTypes.func.isRequired,
  GetUserEntryTags: PropTypes.func.isRequired,
  GetUserEntryPeople: PropTypes.func.isRequired,
  ResetEntriesSortAndFilterMaps: PropTypes.func.isRequired,
  ResetMap: PropTypes.func.isRequired,
}

const isEqual = (prevProps, nextProps) =>
  memoizeProps(prevProps, nextProps, ["userId", "userToken"])

export default reduxConnect(
  mapStateToProps,
  mapDispatchToProps
)(memo(App, isEqual))
