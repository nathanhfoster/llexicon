import axios from "axios"
import { getPersistedReduxStore } from "../localState"

const { REACT_APP_API_URL } = process.env

const getUser = () => {
  let userFromLocalStorage = {}
  const persistedReduxStore = getPersistedReduxStore()
  if (persistedReduxStore) {
    const { User } = persistedReduxStore
    if (!User) return { token: null, offline_mode: null }
    const {
      token,
      Settings: { offline_mode },
    } = User
    userFromLocalStorage = { token, offline_mode }
  }

  return userFromLocalStorage
}

const base = {
  Accept: "application/json",
}

const baseHeaders = {
  ...base,
  "Cache-Control": "no-cache",
  "Content-Type": "application/x-www-form-urlencoded",
}

const baseFormHeaders = (payload) => ({
  ...base,
  "Accept-Language": "en-US,en;q=0.8",
  "Content-Type": `multipart/form-data; boundary=${payload._boundary}`,
})

const isNotLoggedInAxios = () => {
  return axios.create({ baseURL: "https://offline_mode" })
}

/*
Axios request response : https://kapeli.com/cheat_sheets/Axios.docset/Contents/Resources/Documents/index
{
  // `data` is the response that was provided by the server
  data: {},
  // `status` is the HTTP status code from the server response
  status: 200,
  // `statusText` is the HTTP status message from the server response
  statusText: 'OK',
  // `headers` the headers that the server responded with
  // All header names are lower cased
  headers: {},
  // `config` is the config that was provided to `axios` for the request
  config: {},
  // `request` is the request that generated this response
  // It is the last ClientRequest instance in node.js (in redirects)
  // and an XMLHttpRequest instance the browser
  request: {}
}
*/

const Axios = (responseType = "json") => {
  const { token, offline_mode } = getUser()
  if (offline_mode) return isNotLoggedInAxios()
  return axios.create({
    withCredentials: true,
    baseURL: REACT_APP_API_URL,
    //timeout: 25000,
    crossDomain: true,
    responseType,
    headers: token
      ? {
          Authorization: `Token ${token}`,
          ...baseHeaders,
        }
      : baseHeaders,
  })
}

const AxiosCors = (responseType = 'json') =>
  axios.create({
    withCredentials: false,
    baseURL: REACT_APP_API_URL,
    // timeout: 25000,
    crossDomain: true,
    mode: 'cors',
    responseType
  })

const AxiosOffline = (responseType = "json") => {
  const { token } = getUser()

  return axios.create({
    withCredentials: token ? true : false,
    baseURL: REACT_APP_API_URL,
    //timeout: 25000,
    crossDomain: true,
    responseType,
    headers: token
      ? {
          Authorization: `Token ${token}`,
          ...baseHeaders,
        }
      : baseHeaders,
  })
}

const AxiosForm = (payload) => {
  const { token } = getUser()
  return axios.create({
    baseURL: REACT_APP_API_URL,
    // timeout: 25000,
    headers: token
      ? {
          Authorization: `Token ${token}`,
          ...baseFormHeaders(payload),
        }
      : baseFormHeaders(payload),
  })
}

const AxiosData = (token, payload) => {
  return axios.create({
    withCredentials: token ? true : false,
    baseURL: REACT_APP_API_URL,
    timeout: 25000,
    async: true,
    crossDomain: true,
    headers: token
      ? {
          Authorization: `Token ${token}`,
          ...baseHeaders,
        }
      : baseHeaders,
    data: payload,
  })
}

// dispatchActions is an array of actions that will be
// recursively called using .then promise since an action that => or returns Axios() is a promise.
const Sync = (dispatchActions) => async (dispatch) => {
  // console.log("Sync: ", dispatchActions)
  if (!Array.isArray(dispatchActions)) return await dispatch(dispatchActions)
  if (dispatchActions.length === 0) return
  const [firstAction, ...restOfActions] = dispatchActions

  // console.log("firstAction: ", firstAction)
  // console.log("restOfActions: ", restOfActions)

  await dispatch(firstAction)
    .then(async () => await dispatch(Sync(restOfActions)))
    .catch((e) => {
      console.log(JSON.parse(JSON.stringify(e)))
      return
    })
}

export { Axios, AxiosCors, AxiosOffline, AxiosForm, AxiosData, Sync }
