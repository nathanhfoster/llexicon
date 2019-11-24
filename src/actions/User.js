import { ReduxActions } from "../constants"
import { Axios, AxiosForm } from "."
import qs from "qs"
import { CookieMap } from "../constants"
import { GetUserSettings } from "./Settings"
const ChangeUser = payload => ({ type: ReduxActions.USER_SET, payload })

const UserLogin = (payload, rememberMe) => dispatch =>
  Axios()
    .post("login/", qs.stringify(payload))
    .then(res => {
      const { id, token } = res.data
      dispatch(RefreshPatchUser(token, id))
      dispatch({
        type: ReduxActions.USER_SET,
        payload: res.data
      })
    })
    .catch(e => console.log("UserLogin: ", e.response))

const RefreshPatchUser = (token, id) => (dispatch, getState) =>
  Axios()
    .get(`users/${id}/refresh/`)
    .then(res => {
      dispatch({
        type: ReduxActions.USER_SET,
        payload: res.data
      })
    })
    .catch(e =>
      e.response && e.response.status == 401
        ? dispatch({
            type: ReduxActions.REDUX_RESET,
            payload: null
          })
        : console.log(e)
    )

const UserLogout = () => ({ type: ReduxActions.REDUX_RESET })

const CreateUser = (payload, rememberMe) => async dispatch =>
  await Axios()
    .post("users/", qs.stringify(payload))
    .then(async res => await dispatch(UserLogin(payload, rememberMe)))
    .catch(e => console.log("CreateUser: ", e.response))

const UpdateUser = payload => async (dispatch, getState) => {
  const { id } = getState().User
  return await Axios()
    .patch(`users/${id}/`, qs.stringify(payload))
    .then(async res =>
      dispatch({ type: ReduxActions.USER_UPDATE_SUCCESS, payload: res.data })
    )
    .catch(e => console.log("UpdateUser: ", e.response))
}

const UpdateProfile = payload => async (dispatch, getState) => {
  const { id } = getState().User
  await dispatch({ type: ReduxActions.USER_UPDATE_LOADING })
  return await AxiosForm(payload)
    .patch(`users/${id}/`, payload)
    .then(res => {
      dispatch({
        type: ReduxActions.USER_UPDATE_SUCCESS,
        payload: res.data
      })
    })
    .catch(e => console.log("UpdateProfile: ", e.response))
}

const ClearUserApi = () => ({
  type: ReduxActions.CLEAR_USER_API
})

const SetUserLocation = position => dispatch => {
  let { coords, timestamp } = position
  const {
    accuracy,
    altitude,
    altitudeAccuracy,
    heading,
    latitude,
    longitude,
    speed
  } = coords
  dispatch({
    type: ReduxActions.SET_USER_LOCATION,
    payload: {
      accuracy,
      altitude,
      altitudeAccuracy,
      heading,
      latitude,
      longitude,
      speed,
      timestamp
    }
  })
}

const GetUserLocation = () => dispatch => {
  const { geolocation } = navigator
  geolocation.getCurrentPosition(
    position => {
      //console.log("GetUserLocation:", position)
      dispatch(SetUserLocation(position))
    },
    error =>
      console.log("GetUserLocation ERROR: ", JSON.parse(JSON.stringify(error))),
    { enableHighAccuracy: true, timeout: 3000, maximumAge: 1000 }
  )
}

const WatchUserLocation = watchId => dispatch => {
  const { geolocation } = navigator
  if (watchId) return geolocation.clearWatch(watchId)
  geolocation.watchPosition(
    position => {
      // console.log("WatchUserLocation:", position);
      dispatch(SetUserLocation(position))
    },
    error =>
      console.log(
        "WatchUserLocation ERROR: ",
        JSON.parse(JSON.stringify(error))
      ),
    { enableHighAccuracy: true, timeout: 3000, maximumAge: 10000 }
  )
}

export {
  ChangeUser,
  UserLogin,
  RefreshPatchUser,
  UserLogout,
  CreateUser,
  UpdateUser,
  UpdateProfile,
  ClearUserApi,
  SetUserLocation,
  GetUserLocation,
  WatchUserLocation
}
