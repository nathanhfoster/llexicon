const RouteMap = {
  ROOT: "/",
  SETTINGS: "/settings",
  HOME: "/home",
  NEW_ENTRY: "/new-entry",
  CALENDAR: "/calendar",
  ENTRY_DETAIL: "/calendar/:entryId",
  ENTRY_ADD: "/entry/add",
  ENTRIES: "/entries",
  LOGIN: "/login",
  SIGNUP: "/sign-up",
  PRIVACY_POLICY: "/privacy-policy"
}

const RouterPush = (history, route) => {
  const { pathname } = history.location
  history.push(route, { previousRoute: pathname })
}

const RouterLinkPush = (history, route) => {
  const { pathname } = history.location
  return {
    pathname: route,
    state: { previousRoute: pathname }
  }
}

const RouterGoBack = history => {
  const {
    location: {
      hash,
      key,
      pathname,
      search,
      state: { previousRoute }
    }
  } = history
  const { CALENDAR } = RouteMap
  if (previousRoute) return history.goBack()
  else return RouterPush(history, CALENDAR)
}

export { RouteMap, RouterPush, RouterLinkPush, RouterGoBack }
