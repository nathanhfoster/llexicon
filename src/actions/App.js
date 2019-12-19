import { ReduxActions } from "../constants"
import { Axios } from "."
import qs from "qs"

const SetWindow = payload => ({
  type: ReduxActions.SET_WINDOW,
  payload
})

const ResetRedux = () => dispatch =>
  dispatch({ type: ReduxActions.REDUX_RESET })

const setApiResponse = response => ({
  type: ReduxActions.SET_API_RESPONSE,
  payload: response
})

const clearApiResponse = () => ({
  type: ReduxActions.SET_API_RESPONSE,
  payload: null
})

const setUser = User => ({
  type: ReduxActions.GET_USER,
  payload: User
})

const setHtmlDocument = Document => ({
  type: ReduxActions.GET_HTML_DOCUMENT,
  payload: Document
})

const clearHtmlDocument = () => ({ type: ReduxActions.CLEAR_HTML_DOCUMENT })

const SetAppVersion = () => (dispatch, getState) => {
  const { version } = getState().Window

  return Axios()
    .get("versions/view/")
    .then(res => {
      const { date_created, date_updated } = res.data
      const latestAppVersion = new Date(date_created)
      const clientVersion = new Date(version)
      const clientNeedsUpdate = clientVersion - latestAppVersion < 0
      if (clientNeedsUpdate) {
        const message = "There is a new version of the app!"
        dispatch({ type: ReduxActions.SET_APP_VERSION, payload: date_created })
        // dispatch({ type: ReduxActions.REDUX_RESET })
        dispatch({
          type: ReduxActions.ALERTS_SET_MESSAGE,
          payload: {
            title: "App Update",
            message
          }
        })
        setTimeout(() => window.location.reload(), 3500)
      }
    })
    .catch(e => console.log(e))
}

const GetAppVersion = () => (dispatch, getState) => {
  let { version } = getState().Window

  if (!version) version = new Date()

  console.log("SetAppVersion: ", version)

  return Axios()
    .post("versions/latest/", qs.stringify({ version }))
    .then(res => {
      dispatch({ type: ReduxActions.SET_APP_VERSION, payload: res.data })
    })
    .catch(e => console.log(e))
}

export {
  SetWindow,
  ResetRedux,
  setApiResponse,
  clearApiResponse,
  setUser,
  setHtmlDocument,
  clearHtmlDocument,
  SetAppVersion,
  GetAppVersion
}
