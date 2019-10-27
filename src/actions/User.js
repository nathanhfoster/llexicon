import { ReduxActions } from "../constants"
import { Axios, AxiosForm } from "."
import qs from "qs"
import { CookieMap } from "../constants"

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
            type: ReduxActions.USER_SET_LOGOUT,
            payload: null
          })
        : console.log(e)
    )

const UserLogout = () => dispatch => {
  return dispatch({
    type: ReduxActions.USER_SET_LOGOUT,
    payload: null
  })
}

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

const Logout = () => ({
  type: ReduxActions.USER_SET_LOGOUT,
  payload: null
})

const ClearUserApi = () => ({
  type: ReduxActions.CLEAR_USER_API
})

export {
  ChangeUser,
  UserLogin,
  RefreshPatchUser,
  UserLogout,
  CreateUser,
  UpdateUser,
  UpdateProfile,
  Logout,
  ClearUserApi
}
