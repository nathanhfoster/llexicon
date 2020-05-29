import actionTypes from "./actionTypes"
import { combineReducers } from "./combineReducers"
// import {createStore} from './createStore'
import isPlainObject from "./isPlainObject"

const isAFunction = (object) =>
  object instanceof Function || typeof object === "function"

export {
  actionTypes,
  combineReducers,
  // createStore,
  isPlainObject,
  isAFunction,
}
