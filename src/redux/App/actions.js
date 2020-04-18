import { WindowActionTypes } from "../Window/types"
import { AppActionTypes } from "../App/types"
import { AlertActionTypes } from "../Alerts/types"
import { Axios } from "../Actions"
import axios from "axios"
import qs from "qs"
import ReactGA from "react-ga"
const { PUBLIC_URL } = process.env
// Must be the same integer as the one in the /public/version.txt file
const LATEST_APP_VERSION = 2

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
            title: `App Update`,
            message: `You are on version ${data}. The latest version of the app is ${LATEST_APP_VERSION}!`,
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
