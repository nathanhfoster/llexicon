import { ReduxActions } from "../constants"
import { Axios, AxiosForm } from "."
import qs from "qs"

const {
  USER_SET,
  USER_SET_SETTINGS,
  USER_SET_LOCATION,
  USER_RESET_LOCATION,
  REDUX_RESET,
  ALERTS_SET_MESSAGE
} = ReduxActions

const ChangeUser = payload => ({ type: USER_SET, payload })

const UserLogin = (payload, rememberMe) => dispatch =>
  Axios()
    .post("login/", qs.stringify(payload))
    .then(res => {
      const { id, token } = res.data
      dispatch(RefreshPatchUser(token, id))
      dispatch({
        type: USER_SET,
        payload: res.data
      })
    })
    .catch(e => console.log("UserLogin: ", e.response))

const RefreshPatchUser = (token, id) => (dispatch, getState) =>
  Axios()
    .get(`users/${id}/refresh/`)
    .then(res => {
      dispatch({
        type: USER_SET,
        payload: res.data
      })
    })
    .catch(e =>
      e.response && e.response.status == 401
        ? dispatch({
            type: REDUX_RESET,
            payload: null
          })
        : console.log(e)
    )

const UserLogout = () => ({ type: REDUX_RESET })

const CreateUser = (payload, rememberMe) => dispatch =>
  Axios()
    .post("users/", qs.stringify(payload))
    .then(res => dispatch(UserLogin(payload, rememberMe)))
    .catch(e => console.log("CreateUser: ", e.response))

const UpdateUser = payload => (dispatch, getState) => {
  const { id } = getState().User
  return Axios()
    .patch(`users/${id}/`, qs.stringify(payload))
    .then(res => {
      dispatch({ type: USER_SET, payload: res.data })
      dispatch({
        type: ALERTS_SET_MESSAGE,
        payload: { title: "Updated", message: "Profile" }
      })
    })
    .catch(e => console.log("UpdateUser ERROR: ", e))
}

const UpdateProfile = payload => (dispatch, getState) => {
  const { id } = getState().User
  // await dispatch({ type: USER_UPDATE_LOADING })
  return AxiosForm(payload)
    .patch(`users/${id}/`, payload)
    .then(res => {
      dispatch({
        type: USER_SET,
        payload: res.data
      })
    })
    .catch(e => console.log("UpdateProfile: ", e.response))
}

const SetUserLocation = position => dispatch => {
  if (!position) {
    return dispatch({ type: USER_RESET_LOCATION })
  }
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
    type: USER_SET_LOCATION,
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
  return geolocation.getCurrentPosition(
    position => {
      //console.log("GetUserLocation:", position)
      dispatch(SetUserLocation(position))
    },
    error => console.log("GetUserLocation ERROR: ", error),
    { enableHighAccuracy: true, timeout: 3000, maximumAge: 1000 }
  )
}

const WatchUserLocation = watchId => dispatch => {
  const { geolocation } = navigator
  if (watchId) {
    dispatch(SetUserLocation(null))
    return geolocation.clearWatch(watchId)
  }
  dispatch(GetUserLocation())
  return geolocation.watchPosition(
    position => {
      // console.log("WatchUserLocation:", position)
      dispatch(SetUserLocation(position))
    },
    error => console.log("WatchUserLocation ERROR: ", error),
    { enableHighAccuracy: true, timeout: 3000, maximumAge: 10000 }
  )
}

const PasswordReset = payload => dispatch =>
  Axios()
    .post("rest-auth/password/reset/", qs.stringify(payload))
    .then(res => {
      const { detail } = res.data
      dispatch({
        type: ALERTS_SET_MESSAGE,
        payload: { title: "Password Reset", message: detail }
      })
    })
    .catch(e => {
      console.log(JSON.parse(JSON.stringify(e)))
      dispatch({
        type: ALERTS_SET_MESSAGE,
        payload: { title: "Password Reset", message: "ERROR" }
      })
    })

export {
  ChangeUser,
  UserLogin,
  RefreshPatchUser,
  UserLogout,
  CreateUser,
  UpdateUser,
  UpdateProfile,
  SetUserLocation,
  GetUserLocation,
  WatchUserLocation,
  PasswordReset
}
