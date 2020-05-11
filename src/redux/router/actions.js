import React from "react"
import { Redirect } from "react-router-dom"
import { RouteMap } from "./types"
import { history } from "./reducer"

const RouterPush = (route) => {
  history.push(route)
}

const RouterLinkPush = (route) => {
  let {
    location: { state },
  } = history

  const newState = {
    pathname: route,
    state,
  }

  return newState
}

const RouterGoBack = (
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
    if (shouldRedirect) return <Redirect push to={RouterLinkPush(route)} />
    else return RouterPush(route)
  } catch {
    return history.goBack()
  }
}

const GetEntryDetailUrl = (id) => RouteMap.ENTRY_DETAIL.replace(":entryId", id)

const GoToEntryDetail = (id) => RouterPush(GetEntryDetailUrl(id))

export {
  RouteMap,
  RouterPush,
  RouterLinkPush,
  RouterGoBack,
  GetEntryDetailUrl,
  GoToEntryDetail,
}
