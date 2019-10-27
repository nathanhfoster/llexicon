import { ReduxActions } from "../constants"
import { Axios } from "."
import qs from "qs"

const GetUserSettings = () => (dispatch, getState) => {
  const { id } = getState().User
  return Axios()
    .get(`user/settings/${id}/view/`)
    .then(res => {
      dispatch({
        type: ReduxActions.USER_SET_SETTINGS,
        payload: res.data
      })
    })
    .catch(e => console.log(e))
}

const PostSettings = payload => dispatch =>
  Axios()
    .post(`user/settings/`, qs.stringify(payload))
    .then(res => {
      dispatch({
        type: ReduxActions.USER_SET_SETTINGS,
        payload: res.data
      })
    })
    .catch(e => console.log("PostSettings: ", e.response))

const SetSettings = payload => (dispatch, getState) => {
  const { id } = getState().User.Settings
  return Axios()
    .patch(`user/settings/${id}/`, qs.stringify(payload))
    .then(res => {
      dispatch({
        type: ReduxActions.USER_SET_SETTINGS,
        payload: res.data
      })
    })
    .catch(e => console.log("SetSettings: ", e.response))
}

export { GetUserSettings, PostSettings, SetSettings }
