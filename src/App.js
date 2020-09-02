import React, { useEffect, lazy, memo, Fragment } from "react"
import PropTypes from "prop-types"
import { UserProps } from "./redux/User/propTypes"
import { connect as reduxConnect } from "react-redux"
import { Route, Switch, Redirect } from "react-router-dom"
import { SetLocalStorageUsage } from "./redux/App/actions"
import { SetWindow } from "./redux/Window/actions"
import { ResetUserError, GetUserSettings } from "./redux/User/actions"
import { SetCalendar } from "./redux/Calendar/actions"
import {
  SyncEntries,
  GetUserEntries,
  GetUserEntryTags,
  GetUserEntryPeople,
  GetUserEntriesByDate,
  ResetEntriesSortAndFilterMaps,
  ResetSearchEntries,
} from "./redux/Entries/actions"
import { ResetMap } from "./redux/Map/actions"
import { RouteMap, RouterGoBack } from "./redux/router/actions"
import { Admin, About, Home, Entries, PrivacyPolicy } from "./views"
import { NavBar } from "./components"
import { RouterLinkPush } from "./redux/router/actions"
import memoizeProps from "./utils/memoizeProps"
import { useAddToHomescreenPrompt } from "hooks"

const AlertNotifications = lazy(() => import("./components/AlertNotifications"))
const Account = lazy(() => import("./views/Account"))
const BackgroundImage = lazy(() => import("./components/BackgroundImage"))
const Settings = lazy(() => import("./views/Settings"))
const Support = lazy(() => import("./views/Support"))
const EntryDetail = lazy(() => import("./views/EntryDetail"))
const PageNotFound = lazy(() => import("./views/PageNotFound"))

const {
  ADMIN,
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

const mapStateToProps = ({
  User: {
    id,
    token,
    Settings: { dark_mode },
    is_superuser,
  },
}) => ({
  userId: id,
  userToken: token,
  userIsSuperUser: is_superuser,
  userDarkMode: dark_mode,
})

const mapDispatchToProps = {
  SetWindow,
  SetLocalStorageUsage,
  ResetUserError,
  GetUserSettings,
  SetCalendar,
  SyncEntries,
  GetUserEntries,
  GetUserEntryTags,
  GetUserEntryPeople,
  GetUserEntriesByDate,
  ResetEntriesSortAndFilterMaps,
  ResetSearchEntries,
  ResetMap,
}

const DARK_MODE_THEME = {
  "--primaryColor": "#29303b",
  "--primaryColorRGB": "41, 48, 59",
  "--secondaryColor": "white",
  "--tertiarycolor": "#bdc3c7",
  "--quaternaryColor": "rgb(21, 32, 43)",
  "--quinaryColor": "#1f2326",
}

const LIGHT_MODE_THEME = {
  "--primaryColor": "white",
  "--primaryColorRGB": "255, 255, 255",
  "--secondaryColor": "black",
  "--tertiarycolor": "rgba(0, 0, 0, 0.75)",
  "--quaternaryColor": "#dfe6e9",
  "--quinaryColor": "#bdc3c7",
}

const mapThemeProperties = (themeObject) => {
  let root = document.documentElement

  for (const [key, value] of Object.entries(themeObject)) {
    root.style.setProperty(key, value)
  }
}

const changeTheme = (darkMode) =>
  darkMode
    ? mapThemeProperties(DARK_MODE_THEME)
    : mapThemeProperties(LIGHT_MODE_THEME)

const App = ({
  ResetUserError,
  GetUserSettings,
  userId,
  userToken,
  userIsSuperUser,
  userDarkMode,
  SetWindow,
  SetLocalStorageUsage,
  SetCalendar,
  SyncEntries,
  GetUserEntries,
  GetUserEntryTags,
  GetUserEntryPeople,
  GetUserEntriesByDate,
  ResetEntriesSortAndFilterMaps,
  ResetSearchEntries,
  ResetMap,
}) => {
  const [prompt, promptToInstall] = useAddToHomescreenPrompt()
  const handleResize = () => SetWindow()
  useEffect(() => {
    changeTheme(userDarkMode)
  }, [userDarkMode])
  useEffect(() => {
    const activeDate = new Date()
    ResetUserError()
    SetCalendar({ activeDate })
    ResetEntriesSortAndFilterMaps()
    ResetMap()
    ResetSearchEntries()

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

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const renderRedirectOrComponent = (shouldRedirect, component, route) => {
    if (shouldRedirect && route === "GoBack") return () => RouterGoBack(true)
    const directTo = () => RouterLinkPush(route)
    return shouldRedirect ? () => <Redirect push to={directTo} /> : component
  }

  return (
    <main className={userDarkMode ? "DarkMode" : "LightMode"}>
      <div id="portal-root"></div>
      <AlertNotifications />
      <NavBar prompt={prompt} promptToInstall={promptToInstall} />
      <div className="App RouteOverlay">
        <BackgroundImage />
        <Switch>
          <Route
            exact={true}
            path={[ADMIN]}
            component={renderRedirectOrComponent(
              !userIsSuperUser,
              Admin,
              "GoBack"
            )}
          />
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
            render={({
              match: {
                params: { entryId },
              },
            }) => <EntryDetail entryId={entryId} />}
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
      </div>
    </main>
  )
}

App.propTypes = {
  userId: PropTypes.number,
  userToken: PropTypes.string,
  userIsSuperUser: PropTypes.bool,
  userDarkMode: PropTypes.bool,
  SetWindow: PropTypes.func.isRequired,
  SetLocalStorageUsage: PropTypes.func.isRequired,
  ResetUserError: PropTypes.func.isRequired,
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
  memoizeProps(prevProps, nextProps, ["userId", "userToken", "userDarkMode"])

export default reduxConnect(
  mapStateToProps,
  mapDispatchToProps
)(memo(App, isEqual))
