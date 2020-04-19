import { WindowActionTypes } from "../Window/types"
import { AppActionTypes } from "../App/types"
import { Axios } from "../Actions"
import axios from "axios"
import qs from "qs"
import ReactGA from "react-ga"
const { PUBLIC_URL } = process.env

const SetWindow = (payload) => ({
  type: WindowActionTypes.SET_WINDOW,
  payload,
})

const ResetRedux = () => (dispatch) =>
  dispatch({ type: AppActionTypes.REDUX_RESET })

const GetAppVersion = () => (dispatch, getState) => {
  const {
    App: { version },
  } = getState()
  return axios
    .get(`${PUBLIC_URL}/version.txt`)
    .then(({ data }) => {
      dispatch({ type: AppActionTypes.APP_SET_VERSION, payload: data })
      ReactGA.event({
        category: "Check App Version",
        action: "User got the latest app version!",
        value: data,
      })

      return { currentVersion: version, latestVersion: data }
    })
    .catch(({ response }) => console.log("ERROR: ", response))
}

export { SetWindow, ResetRedux, GetAppVersion }
