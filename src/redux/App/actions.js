import { AppActionTypes } from "../App/types"
import axios from "axios"
import ReactGA from "react-ga"
const { PUBLIC_URL } = process.env

const SetLocalStorageUsage = () => (dispatch) => {
  if ("storage" in navigator && "estimate" in navigator.storage) {
    return navigator.storage
      .estimate()
      .then(({ usage, quota, usageDetails }) => {
        const payload = {
          localStorageUsage: usage,
          localStorageQuota: quota,
          localStorageUsageDetails: usageDetails,
        }
        dispatch({ type: AppActionTypes.APP_SET_LOCAL_STORAGE_USAGE, payload })
        return [usage, quota]
      })
  }
}

const ResetRedux = () => ({ type: AppActionTypes.REDUX_RESET })

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

export { SetLocalStorageUsage, ResetRedux, GetAppVersion }
