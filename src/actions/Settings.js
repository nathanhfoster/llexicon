import { ReduxActions } from "../constants"
import { Axios, AxiosOffline } from "."
import qs from "qs"

const { ALERTS_SET_MESSAGE, USER_SET_SETTINGS } = ReduxActions

const GetUserSettings = () => (dispatch, getState) => {
  const { id } = getState().User
  return AxiosOffline()
    .get(`user/settings/${id}/view/`)
    .then(res => {
      dispatch({
        type: USER_SET_SETTINGS,
        payload: res.data
      })
    })
    .catch(e => console.log(e))
}

const PostSettings = payload => dispatch =>
  AxiosOffline()
    .post(`user/settings/`, qs.stringify(payload))
    .then(res => {
      dispatch({
        type: USER_SET_SETTINGS,
        payload: res.data
      })
    })
    .catch(e => console.log("PostSettings: ", e.response))

const SetSettings = payload => (dispatch, getState) => {
  const { id } = getState().User.Settings
  return AxiosOffline()
    .patch(`user/settings/${id}/`, qs.stringify(payload))
    .then(res => {
      dispatch({
        type: ALERTS_SET_MESSAGE,
        payload: { title: "Updated", message: "Setting" }
      })
      dispatch({
        type: USER_SET_SETTINGS,
        payload: res.data
      })
    })
    .catch(e => console.log("SetSettings: ", e.response))
}

export { GetUserSettings, PostSettings, SetSettings }
