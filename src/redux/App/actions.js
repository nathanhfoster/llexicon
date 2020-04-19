import { WindowActionTypes } from "../Window/types"
import { AppActionTypes } from "../App/types"
import { AlertActionTypes } from "../Alerts/types"
import { Axios } from "../Actions"
import axios from "axios"
import qs from "qs"
import ReactGA from "react-ga"
import { LATEST_APP_VERSION } from "../../components/Footer"
const { PUBLIC_URL } = process.env

const SetWindow = (payload) => ({
  type: WindowActionTypes.SET_WINDOW,
  payload,
})

const ResetRedux = () => (dispatch) =>
  dispatch({ type: AppActionTypes.REDUX_RESET })

const CheckAppVersion = () => (dispatch) =>
  axios
    .get(`${PUBLIC_URL}/version.txt`)
    .then(({ data }) => {
      const clientNeedsUpdate = data !== LATEST_APP_VERSION

      if (clientNeedsUpdate) {
        dispatch({
          type: AlertActionTypes.ALERTS_SET_MESSAGE,
          payload: {
            title: `Update Available`,
            message: `You are on version ${LATEST_APP_VERSION}. The latest version is ${data}!`,
          },
        })
        ReactGA.event({
          category: "Check App Version",
          action: "User has an outdated version of the app!",
          value: data,
        })
      }

      return data
    })
    .catch(({ response }) => console.log("ERROR: ", response))

export { SetWindow, ResetRedux, CheckAppVersion }
