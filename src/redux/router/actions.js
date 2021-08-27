import React from 'react'
import { Redirect } from 'react-router-dom'
import * as RouteMap from './types'
import { history } from './reducer'
import { removeArrayDuplicates } from '../../utils'

export const MAX_PATH_HISTORY_LENGTH = 21

export const getHistoryState = route => {
  const { pathname, state } = history.location
  let newState = {}
  if (!(state && state.pathHistory)) {
    newState = {
      previousRoute: pathname,
      pathHistory: [pathname],
    }
  } else {
    const previousRoute = pathname
    const pathHistory = state.pathHistory.concat(pathname).slice(0, MAX_PATH_HISTORY_LENGTH)
    newState = {
      previousRoute,
      pathHistory,
    }
  }

  return newState
}

export const ValidateHistroy = () => {
  if (!history || !history.location) {
    return false
  }
  return true
}

export const RouterPush = route => {
  if (!ValidateHistroy()) return {}

  const newState = getHistoryState(route)

  history.push(route, newState)
}

export const RouterLinkPush = route => {
  if (!ValidateHistroy()) return {}
  const newState = {
    pathname: route,
    state: getHistoryState(route),
  }

  return newState
}

export const RouterGoBack = (
  shouldRedirect = false,
  redirectRoutesToIgnore = [RouteMap.LOGIN, RouteMap.SIGNUP, RouteMap.PASSWORD_RESET],
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
      const newRoute = pathHistory.reverse().find(route => !redirectRoutesToIgnore.includes(route))
      route = newRoute
    }

    if (shouldRedirect) return <Redirect push to={RouterLinkPush(route)} />
    else return RouterPush(route)
  } catch {
    return history.goBack()
  }
}

export const GetEntryDetailUrl = id => RouteMap.ENTRY_DETAIL.replace(':entryId', id)

export const GoToEntryDetail = id => RouterPush(GetEntryDetailUrl(id))

export { RouteMap }
