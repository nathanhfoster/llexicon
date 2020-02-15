import axios from "axios"
import { getReduxState } from "../Persister/actions"

const { REACT_APP_API_URL } = process.env

const getUser = () => {
  const { User } = getReduxState()
  if (!User) return { token: null, offline_mode: null }
  const {
    token,
    Settings: { offline_mode }
  } = User
  return { token, offline_mode }
}

const base = {
  Accept: "application/json"
}

const baseHeaders = {
  ...base,
  "Cache-Control": "no-cache",
  "Content-Type": "application/x-www-form-urlencoded"
}

const baseFormHeaders = payload => ({
  ...base,
  "Accept-Language": "en-US,en;q=0.8",
  "Content-Type": `multipart/form-data; boundary=${payload._boundary}`
})

const Axios = (responseType = "json") => {
  const { token, offline_mode } = getUser()
  if (offline_mode) return axios.create({ baseURL: "https://offline_mode" })
  return axios.create({
    withCredentials: token ? true : false,
    baseURL: REACT_APP_API_URL,
    //timeout: 25000,
    crossDomain: true,
    responseType,
    headers: token
      ? {
          Authorization: `Token ${token}`,
          ...baseHeaders
        }
      : baseHeaders
  })
}

const AxiosOffline = (responseType = "json") => {
  const { token } = getReduxState().User

  return axios.create({
    withCredentials: token ? true : false,
    baseURL: REACT_APP_API_URL,
    //timeout: 25000,
    crossDomain: true,
    responseType,
    headers: token
      ? {
          Authorization: `Token ${token}`,
          ...baseHeaders
        }
      : baseHeaders
  })
}

const AxiosForm = payload => {
  const { token } = getReduxState().User
  return axios.create({
    baseURL: REACT_APP_API_URL,
    // timeout: 25000,
    headers: token
      ? {
          Authorization: `Token ${token}`,
          ...baseFormHeaders(payload)
        }
      : baseFormHeaders(payload)
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
          ...baseHeaders
        }
      : baseHeaders,
    data: payload
  })
}

// dispatchActions is an array of actions that will be
// recursively called using .then promise since an action that => or returns Axios() is a promise.
const Sync = dispatchActions => async dispatch => {
  // console.log("Sync: ", dispatchActions)
  if (!Array.isArray(dispatchActions)) return await dispatch(dispatchActions)
  if (dispatchActions.length === 0) return
  const [firstAction, ...restOfActions] = dispatchActions

  // console.log("firstAction: ", firstAction)
  // console.log("restOfActions: ", restOfActions)

  await dispatch(firstAction)
    .then(async () => await dispatch(Sync(restOfActions)))
    .catch(e => {
      console.log(JSON.parse(JSON.stringify(e)))
      return
    })
}

export { Axios, AxiosOffline, AxiosForm, AxiosData, Sync }
