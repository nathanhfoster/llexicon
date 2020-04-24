import React from "react"
import { Redirect } from "react-router-dom"
const RouteMap = {
  ROOT: "/",
  SETTINGS: "/settings",
  SETTINGS_ENTRIES: "/settings/entries",
  SETTINGS_PROFILE: "/settings/profile",
  SETTINGS_PREFERENCES: "/settings/preferences",
  SETTINGS_STORAGE: "/settings/storage",
  SUPPORT: "/support",
  ABOUT: "/about",
  HOME: "/home",
  NEW_ENTRY: "/new-entry",
  ENTRIES_CALENDAR: "/entries/calendar",
  ENTRY_DETAIL: "/entry/:entryId",
  ENTRIES: "/entries",
  ENTRIES_LIST: "/entries/list",
  ENTRIES_TABLE: "/entries/table",
  ENTRIES_MAP: "/entries/map",
  ENTRIES_FOLDERS: "/entries/folders",
  LOGIN: "/login",
  SIGNUP: "/sign-up",
  PASSWORD_RESET: "/password-reset",
  PRIVACY_POLICY: "/privacy-policy",
}

const getHistoryState = (state, pathname, route) => {
  if (!state) {
    state = {
      previousRoute: pathname,
      pathHistory: [pathname],
    }
  } else {
    state = {
      previousRoute: pathname,
      pathHistory: state.pathHistory.concat(pathname),
    }
  }

  return state
}

const ValidateHistroy = (history) => {
  if (!history || !history.location) {
    return false
  }
  return true
}

const RouterPush = (history, route) => {
  if (!ValidateHistroy(history)) return {}
  let {
    location: { pathname, search, state },
  } = history

  const newState = getHistoryState(state, pathname, route)

  // console.log("RouterPush: ", route, newState)

  history.push(route, newState)
}

const RouterLinkPush = (history, route) => {
  if (!ValidateHistroy(history)) return {}
  let {
    location: { pathname, search, state },
  } = history

  const newState = {
    pathname: route,
    state: getHistoryState(state, pathname, route),
  }

  // console.log("RouterLinkPush: ", route, newState)

  return newState
}

const RouterGoBack = (
  history,
  shouldRedirect = false,
  redirectRoutesToIgnore = [
    RouteMap.LOGIN,
    RouteMap.SIGNUP,
    RouteMap.PASSWORD_RESET,
  ]
) => {
  let route = RouteMap.HOME

  try {
    const {
      location: {
        hash,
        key,
        pathname,
        search,
        state: { previousRoute, pathHistory },
      },
    } = history
    if (pathHistory) {
      const newRoute = pathHistory
        .reverse()
        .find((route) => !redirectRoutesToIgnore.includes(route))
      route = newRoute
    }
    if (shouldRedirect)
      return <Redirect push to={RouterLinkPush(history, route)} />
    else return RouterPush(history, route)
  } catch {
    return history.goBack()
  }
}

const GetEntryDetailUrl = (id) => RouteMap.ENTRY_DETAIL.replace(":entryId", id)

const GoToEntryDetail = (id, history) =>
  RouterPush(history, GetEntryDetailUrl(id))

export {
  RouteMap,
  RouterPush,
  RouterLinkPush,
  RouterGoBack,
  GetEntryDetailUrl,
  GoToEntryDetail,
}
