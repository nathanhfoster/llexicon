import { Axios, AxiosForm, AxiosOffline } from "../Actions"
import { UserActionTypes } from "../User/types"
import { AppActionTypes } from "../App/types"
import { ResetRedux } from "../App/actions"
import { SetAlert } from "../Alerts/actions"
import { persistReduxState } from "../localState"
import { GetUserEntries } from "../Entries/actions"
import { clearReduxStoreFromLocalStorage } from "../localState"
import qs from "qs"
import ReactGA from "react-ga"

const setPendingUser = (payload = true) => ({
  type: UserActionTypes.USER_PENDING,
  payload,
})

const setUserError = ({ config, response, message, name, stack }) => (
  dispatch
) => {
  const { status, statusText } = response || {}
  const payload = { message, name, stack, status, statusText }

  dispatch({
    type: UserActionTypes.USER_ERROR,
    payload,
  })
}

const ResetUserError = () => ({ type: UserActionTypes.USER_RESET_ERROR })

const SetUser = (payload) => ({
  type: UserActionTypes.USER_SET,
  payload,
})

const ChangeUser = (payload) => ({ type: UserActionTypes.USER_SET, payload })

const UserLogin = (payload, rememberMe) => async (dispatch) => {
  dispatch(setPendingUser())
  return await AxiosOffline()
    .post("login/", qs.stringify(payload))
    .then(async ({ data }) => {
      const { id, token } = data
      await dispatch(RefreshPatchUser(id))
      await dispatch(SetUser(data))
      await dispatch(persistReduxState())
      await dispatch(GetUserEntries())
      ReactGA.event({
        category: "Login",
        action: "User logged in!",
      })
      return data
    })
    .catch((e) => dispatch(setUserError(e)))
}

const RefreshPatchUser = (id) => (dispatch) => {
  dispatch(setPendingUser())
  return AxiosOffline()
    .get(`users/${id}/refresh/`)
    .then(({ data }) => {
      dispatch({
        type: UserActionTypes.USER_SET,
        payload: data,
      })
      ReactGA.event({
        category: "Refresh Patch User",
        action: "User refreshed their login",
      })
      return data
    })
    .catch((e) => {
      dispatch(setUserError(e))
      e.response && e.response.status == 401
        ? dispatch({
            type: AppActionTypes.REDUX_RESET,
            payload: null,
          })
        : console.log(e)
    })
}

const UserLogout = () => (dispatch) => dispatch(ResetRedux())

const CreateUser = (payload, rememberMe) => (dispatch) => {
  dispatch(setPendingUser())
  return AxiosOffline()
    .post("users/", qs.stringify(payload))
    .then((res) => {
      dispatch(UserLogin(payload, rememberMe))
      ReactGA.event({
        category: "Sign Up",
        action: "User signed up!",
      })
      return res
    })
    .catch((e) => dispatch(setUserError(e)))
}

const UpdateUser = (payload) => (dispatch, getState) => {
  dispatch(setPendingUser())
  const { id } = getState().User
  return Axios()
    .patch(`users/${id}/`, qs.stringify(payload))
    .then(({ data }) => {
      dispatch({ type: UserActionTypes.USER_SET, payload: data })
      dispatch(SetAlert({ title: "Updated", message: "Profile" }))
      ReactGA.event({
        category: "Update User",
        action: "User updated their account",
      })
      return data
    })
    .catch((e) => dispatch(setUserError(e)))
}

const UpdateProfile = (payload) => (dispatch, getState) => {
  dispatch(setPendingUser())
  const { id } = getState().User
  // await dispatch({ type: USER_UPDATE_LOADING })
  return AxiosForm({ payload })
    .patch(`users/${id}/`, payload)
    .then(({ data }) => {
      dispatch({
        type: UserActionTypes.USER_SET,
        payload: data,
      })
      ReactGA.event({
        category: "Update Profile",
        action: "User updated their profile",
      })
      return data
    })
    .catch((e) => dispatch(setUserError(e)))
}

const SetUserLocation = (position) => (dispatch) => {
  if (!position) {
    return dispatch({ type: UserActionTypes.USER_RESET_LOCATION })
  }

  const { coords, timestamp } = position

  dispatch({
    type: UserActionTypes.USER_SET_LOCATION,
    payload: {
      ...coords,
      timestamp,
    },
  })
}

const PasswordReset = (payload) => (dispatch) => {
  dispatch(setPendingUser())
  return AxiosOffline()
    .post("rest-auth/password/reset/", qs.stringify(payload))
    .then(({ data: { detail } }) => {
      dispatch(
        SetAlert({
          title: "Password Reset",
          message: detail,
        })
      )
      ReactGA.event({
        category: "Password Reset",
        action: "User requested a password reset!",
      })
      dispatch(setPendingUser(false))
    })
    .catch((e) => dispatch(setUserError(e)))
}

const GetUserSettings = () => (dispatch, getState) => {
  const { id } = getState().User
  return AxiosOffline()
    .get(`user/settings/${id}/view/`)
    .then(({ data }) => {
      dispatch({
        type: UserActionTypes.USER_SET_SETTINGS,
        payload: data,
      })
      return data
    })
    .catch((e) => console.log(e))
}

const PostSettings = (payload) => (dispatch) => {
  dispatch({
    type: UserActionTypes.USER_SET_SETTINGS,
    payload,
  })
  return AxiosOffline()
    .post(`user/settings/`, qs.stringify(payload))
    .then(({ data }) => {
      dispatch({
        type: UserActionTypes.USER_SET_SETTINGS,
        payload: data,
      })
      ReactGA.event({
        category: "Post Settings",
        action: "User posted a new setting!",
      })
      return data
    })
    .catch((e) => console.log("PostSettings: ", e.response))
}
const UpdateSettings = (payload) => (dispatch, getState) => {
  const { id } = getState().User.Settings
  dispatch({
    type: UserActionTypes.USER_SET_SETTINGS,
    payload,
  })

  return AxiosOffline()
    .patch(`user/settings/${id}/`, qs.stringify(payload))
    .then(({ data }) => {
      dispatch(SetAlert({ title: "Updated", message: "Setting" }))
      dispatch({
        type: UserActionTypes.USER_SET_SETTINGS,
        payload: data,
      })
      ReactGA.event({
        category: "Update Settings",
        action: "User updated a setting!",
      })
      return data
    })
    .catch((e) => console.log("UpdateSettings: ", e.response))
}

const DeleteAccount = (userId) => (dispatch, getState) => {
  const { id } = getState().User
  return AxiosOffline()
    .delete(`users/${userId || id}/`)
    .then((res) => {
      dispatch(SetAlert({ title: "Deleted", message: "Account" }))
      clearReduxStoreFromLocalStorage()
      dispatch(ResetRedux())
      ReactGA.event({
        category: "Delete Account",
        action: "User deleted their account!",
      })
      return res
    })
    .catch((e) => console.log("DeleteAccount: ", e.response))
}

const SearchForUsers = (search) =>
  Axios.get(`/users?search=${search}/`)
    .then(({ data }) => {})
    .catch((e) => console.log("SearchForUsers: ", e.response))

export {
  ResetUserError,
  SetUser,
  ChangeUser,
  UserLogin,
  RefreshPatchUser,
  UserLogout,
  CreateUser,
  UpdateUser,
  UpdateProfile,
  SetUserLocation,
  PasswordReset,
  GetUserSettings,
  PostSettings,
  UpdateSettings,
  DeleteAccount,
  SearchForUsers,
}
