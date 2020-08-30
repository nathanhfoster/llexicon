import actionTypes from "./actionTypes"
import { combineReducers } from "./combineReducers"
import isPlainObject from "./isPlainObject"

const isAFunction = (object) =>
  object instanceof Function || typeof object === "function"

const isQuotaExceeded = (e) => {
  let quotaExceeded = false
  if (e) {
    if (e.code) {
      switch (e.code) {
        case 22:
          quotaExceeded = true
          break
        case 1014:
          // Firefox
          if (e.name == "NS_ERROR_DOM_QUOTA_REACHED") {
            quotaExceeded = true
          }
          break
        default:
          break
      }
    } else if (e.number == -2147024882) {
      // Internet Explorer 8
      quotaExceeded = true
    }
  }
  return quotaExceeded
}

export {
  actionTypes,
  combineReducers,
  isPlainObject,
  isAFunction,
  isQuotaExceeded,
}
