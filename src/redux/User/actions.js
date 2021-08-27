import { Axios, AxiosForm, AxiosOffline } from '../Actions'
import actions from '../actionTypes'
import { ResetRedux } from '../App/actions'
import { SetAlert } from '../Alerts/actions'
import { persistReduxState } from '../localState'
import { GetUserEntries } from '../Entries/actions'
import { clearReduxStoreFromLocalStorage } from '../localState'
import qs from 'qs'

export const setPendingUser = (payload = true) => ({
  type: actions.USER_PENDING,
  payload,
})

export const setUserError = ({ config, response, message, name, stack }) => dispatch => {
  const { status, statusText } = response || {}
  const payload = { message, name, stack, status, statusText }

  dispatch({
    type: actions.USER_ERROR,
    payload,
  })
}

export const ResetUserError = () => ({ type: actions.USER_RESET_ERROR })

export const SetUser = payload => ({
  type: actions.USER_SET,
  payload,
})

export const ChangeUser = payload => ({ type: actions.USER_SET, payload })

export const UserLogin = (payload, rememberMe) => async dispatch => {
  dispatch(setPendingUser())
  return await AxiosOffline()
    .post('login/', qs.stringify(payload))
    .then(async ({ data }) => {
      const { id, token } = data
      await dispatch(RefreshPatchUser(id))
      await dispatch(SetUser(data))
      await dispatch(persistReduxState())
      await dispatch(GetUserEntries())

      return data
    })
    .catch(e => dispatch(setUserError(e)))
}

export const RefreshPatchUser = id => dispatch => {
  dispatch(setPendingUser())
  return AxiosOffline()
    .get(`users/${id}/refresh/`)
    .then(({ data }) => {
      dispatch({
        type: actions.USER_SET,
        payload: data,
      })
      return data
    })
    .catch(e => {
      dispatch(setUserError(e))
      e.response && e.response.status == 401
        ? dispatch({
            type: actions.REDUX_RESET,
            payload: null,
          })
        : console.log(e)
    })
}

export const UserLogout = () => dispatch => dispatch(ResetRedux())

export const CreateUser = (payload, rememberMe) => dispatch => {
  dispatch(setPendingUser())
  return AxiosOffline()
    .post('users/', qs.stringify(payload))
    .then(res => {
      dispatch(UserLogin(payload, rememberMe))
      return res
    })
    .catch(e => dispatch(setUserError(e)))
}

export const UpdateUser = payload => (dispatch, getState) => {
  dispatch(setPendingUser())
  const { id } = getState().User
  return Axios()
    .patch(`users/${id}/`, qs.stringify(payload))
    .then(({ data }) => {
      dispatch({ type: actions.USER_SET, payload: data })
      dispatch(SetAlert({ title: 'Updated', message: 'Profile' }))
      return data
    })
    .catch(e => dispatch(setUserError(e)))
}

export const UpdateProfile = payload => (dispatch, getState) => {
  dispatch(setPendingUser())
  const { id } = getState().User
  // await dispatch({ type: USER_UPDATE_LOADING })
  return AxiosForm({ payload })
    .patch(`users/${id}/`, payload)
    .then(({ data }) => {
      dispatch({
        type: actions.USER_SET,
        payload: data,
      })

      return data
    })
    .catch(e => dispatch(setUserError(e)))
}

export const SetUserLocation = position => dispatch => {
  if (!position) {
    return dispatch({ type: actions.USER_RESET_LOCATION })
  }

  const { coords, timestamp } = position

  dispatch({
    type: actions.USER_SET_LOCATION,
    payload: {
      ...coords,
      timestamp,
    },
  })
}

export const PasswordReset = payload => dispatch => {
  dispatch(setPendingUser())
  return AxiosOffline()
    .post('rest-auth/password/reset/', qs.stringify(payload))
    .then(({ data: { detail } }) => {
      dispatch(
        SetAlert({
          title: 'Password Reset',
          message: detail,
        }),
      )
      dispatch(setPendingUser(false))
    })
    .catch(e => dispatch(setUserError(e)))
}

export const GetUserSettings = () => (dispatch, getState) => {
  const { id } = getState().User
  return AxiosOffline()
    .get(`user/settings/${id}/view/`)
    .then(({ data }) => {
      dispatch({
        type: actions.USER_SET_SETTINGS,
        payload: data,
      })
      return data
    })
    .catch(e => console.log(e))
}

export const PostSettings = payload => dispatch => {
  dispatch({
    type: actions.USER_SET_SETTINGS,
    payload,
  })
  return AxiosOffline()
    .post(`user/settings/`, qs.stringify(payload))
    .then(({ data }) => {
      dispatch({
        type: actions.USER_SET_SETTINGS,
        payload: data,
      })
      return data
    })
    .catch(e => console.log('PostSettings: ', e.response))
}
export const UpdateSettings = payload => (dispatch, getState) => {
  const { id } = getState().User.Settings
  dispatch({
    type: actions.USER_SET_SETTINGS,
    payload,
  })

  return AxiosOffline()
    .patch(`user/settings/${id}/`, qs.stringify(payload))
    .then(({ data }) => {
      dispatch(SetAlert({ title: 'Updated', message: 'Setting' }))
      dispatch({
        type: actions.USER_SET_SETTINGS,
        payload: data,
      })
      return data
    })
    .catch(e => console.log('UpdateSettings: ', e.response))
}

export const DeleteAccount = userId => (dispatch, getState) => {
  const { id } = getState().User
  return AxiosOffline()
    .delete(`users/${userId || id}/`)
    .then(res => {
      dispatch(SetAlert({ title: 'Deleted', message: 'Account' }))
      clearReduxStoreFromLocalStorage()
      dispatch(ResetRedux())
      return res
    })
    .catch(e => console.log('DeleteAccount: ', e.response))
}

export const SearchForUsers = search =>
  Axios.get(`/users?search=${search}/`)
    .then(({ data }) => {})
    .catch(e => console.log('SearchForUsers: ', e.response))
