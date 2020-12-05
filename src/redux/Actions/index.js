import axios from "axios"
import { getUser } from "../localState"

/**
 * Config global for axios/django
 */
axios.defaults.xsrfHeaderName = "X-CSRFToken"
axios.defaults.xsrfCookieName = "csrftoken"

const { REACT_APP_API_URL } = process.env

const axiosDefaults = {
  baseURL: REACT_APP_API_URL,
  timeout: 0,
  xsrfHeaderName: "X-CSRFTOKEN",
  xsrfCookieName: "csrftoken",
  onUploadProgress: (e) => {
    // console.log(e)
  },
  onDownloadProgress: (e) => {
    // console.log(e)
  },
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

const Axios = (props) => {
  const { authToken, responseType = "json" } = props ? props : {}
  const {
    token: userToken,
    Settings: { offline_mode },
  } = getUser()
  const token = authToken || userToken
  if (offline_mode) return isNotLoggedInAxios()
  return axios.create({
    ...axiosDefaults,
    withCredentials: true,
    responseType,
    headers: token
      ? {
          Authorization: `Token ${token}`,
          ...baseHeaders,
        }
      : baseHeaders,
  })
}

const AxiosOffline = (responseType = "json") => {
  const { token } = getUser()

  return axios.create({
    ...axiosDefaults,
    withCredentials: token ? true : false,
    responseType,
    headers: token
      ? {
          Authorization: `Token ${token}`,
          ...baseHeaders,
        }
      : baseHeaders,
  })
}

const AxiosForm = (props) => {
  const { authToken, payload } = props ? props : {}
  const { token: userToken } = getUser()
  const token = authToken || userToken
  return axios.create({
    ...axiosDefaults,
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
    ...axiosDefaults,
    withCredentials: token ? true : false,
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
  if (!Array.isArray(dispatchActions)) return await dispatch(dispatchActions)
  if (dispatchActions.length === 0) return
  const [firstAction, ...restOfActions] = dispatchActions

  await dispatch(firstAction)
    .then(async () => await dispatch(Sync(restOfActions)))
    .catch((e) => {
      console.log(JSON.parse(JSON.stringify(e)))
      return
    })
}

export { isNotLoggedInAxios, Axios, AxiosOffline, AxiosForm, AxiosData, Sync }
