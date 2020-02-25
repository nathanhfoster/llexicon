import { WindowActionTypes } from "../Window/types"
import { AppActionTypes } from "../App/types"
import { AlertActionTypes } from "../Alerts/types"
import { Axios } from "../Actions"
import qs from "qs"

const SetWindow = payload => ({
  type: WindowActionTypes.SET_WINDOW,
  payload
})

const ResetRedux = () => dispatch =>
  dispatch({ type: AppActionTypes.REDUX_RESET })

const CheckAppVersion = () => (dispatch, getState) => {
  const { version } = getState().Window

  return Axios()
    .get("versions/view/")
    .then(({ data: { date_created } }) => {
      const latestAppVersion = new Date(date_created)
      const clientVersion = new Date(version)
      const clientNeedsUpdate = clientVersion - latestAppVersion < 0
      if (clientNeedsUpdate) {
        dispatch({
          type: AlertActionTypes.ALERTS_SET_MESSAGE,
          payload: {
            title: "App Update",
            message: "There is a new version of the app!"
          }
        })
      }
    })
    .catch(e => console.log(e))
}

const SetAppVersion = date_created => ({
  type: AppActionTypes.SET_APP_VERSION,
  payload: date_created
})

const GetAppVersion = () => (dispatch, getState) => {
  let { version } = getState().Window

  if (!version) version = new Date()

  return Axios()
    .post("versions/latest/", qs.stringify({ version }))
    .then(({ data }) => {
      dispatch({ type: AppActionTypes.SET_APP_VERSION, payload: data })
    })
    .catch(e => console.log(e))
}

export { SetWindow, ResetRedux, CheckAppVersion, SetAppVersion, GetAppVersion }
