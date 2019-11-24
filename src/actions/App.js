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

export {
  SetWindow,
  ResetRedux,
  setApiResponse,
  clearApiResponse,
  setUser,
  setHtmlDocument,
  clearHtmlDocument
}
