import { WindowActionTypes } from "../Window/types"
import { AppActionTypes } from "../App/types"
import { AlertActionTypes } from "../Alerts/types"
import { Axios } from "../Actions"
import qs from "qs"
import ReactGA from "react-ga"

const SetWindow = (payload) => ({
  type: WindowActionTypes.SET_WINDOW,
  payload,
})

const ResetRedux = () => (dispatch) =>
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
            message: "There is a new version of the app!",
          },
        })
        ReactGA.event({
          category: "Check App Version",
          action: "User has an outdated version of the app!",
          value: version,
        })
      }
    })
    .catch((e) => console.log(e))
}

const SetAppVersion = (date_created) => ({
  type: AppActionTypes.SET_APP_VERSION,
  payload: date_created,
})

const GetAppVersion = () => (dispatch, getState) => {
  let { version } = getState().Window

  if (!version) version = new Date()

  return Axios()
    .post("versions/latest/", qs.stringify({ version }))
    .then(({ data }) => {
      dispatch({ type: AppActionTypes.SET_APP_VERSION, payload: data })
      ReactGA.event({
        category: "Get App Version",
        action: "User got the app version!",
        value: version,
      })
    })
    .catch((e) => console.log(e))
}

export { SetWindow, ResetRedux, CheckAppVersion, SetAppVersion, GetAppVersion }
