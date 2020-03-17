import React from "react"
import { Redirect } from "react-router-dom"
const RouteMap = {
  ROOT: "/",
  SETTINGS: "/settings",
  SETTINGS_ENTRIES: "/settings/entries",
  SETTINGS_PROFILE: "/settings/profile",
  SETTINGS_PREFERENCES: "/settings/preferences",
  SUPPORT: "/support",
  ABOUT: "/about",
  HOME: "/home",
  NEW_ENTRY: "/new-entry",
  ENTRIES_CALENDAR: "/entries/calendar",
  ENTRY_DETAIL: "/entry/:entryId",
  ENTRIES: "/entries",
  ENTRIES_MINIMAL: "/entries/minimal",
  ENTRIES_DETAILED: "/entries/detailed",
  ENTRIES_TABLE: "/entries/table",
  ENTRIES_MAP: "/entries/map",
  ENTRIES_FOLDERS: "/entries/folders",
  LOGIN: "/login",
  SIGNUP: "/sign-up",
  PASSWORD_RESET: "/password-reset",
  PRIVACY_POLICY: "/privacy-policy"
}

const getHistoryState = (state, pathname, route) => {
  if (!state) {
    state = {
      previousRoute: pathname,
      pathHistory: [pathname]
    }
  } else {
    state = {
      previousRoute: pathname,
      pathHistory: state.pathHistory.concat(pathname)
    }
  }

  return state
}

const ValidateHistroy = history => {
  if (!history || !history.location) {
    return false
  }
  return true
}

const RouterPush = (history, route) => {
  if (!ValidateHistroy(history)) return {}
  let {
    location: { pathname, search, state }
  } = history

  const newState = getHistoryState(state, pathname, route)

  // console.log("RouterPush: ", route, newState)

  history.push(route, newState)
}

const RouterLinkPush = (history, route) => {
  if (!ValidateHistroy(history)) return {}
  let {
    location: { pathname, search, state }
  } = history

  const newState = {
    pathname: route,
    state: getHistoryState(state, pathname, route)
  }

  // console.log("RouterLinkPush: ", route, newState)

  return newState
}

const RouterGoBack = (history, shouldRedirect = false) => {
  let route = RouteMap.HOME
  if (!ValidateHistroy(history) || !history.location.state) return {}
  const {
    location: {
      hash,
      key,
      pathname,
      search,
      state: { previousRoute }
    }
  } = history

  if (previousRoute) {
    route = previousRoute
    if (shouldRedirect) return <Redirect push to={route} />
    else return RouterPush(history, route)
  } else return history.goBack()
}

export { RouteMap, RouterPush, RouterLinkPush, RouterGoBack }
