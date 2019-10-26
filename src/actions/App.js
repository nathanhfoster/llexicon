import { ReduxActions } from "../constants";
import { Axios } from ".";
import qs from "qs";

const setWindow = Window => ({
  type: ReduxActions.SET_WINDOW,
  payload: Window
});

const ResetRedux = () => dispatch => dispatch({ type: ReduxActions.RESET_REDUX });

const setApiResponse = response => ({
  type: ReduxActions.SET_API_RESPONSE,
  payload: response
});

const clearApiResponse = () => ({
  type: ReduxActions.SET_API_RESPONSE,
  payload: null
});

const setUser = User => ({
  type: ReduxActions.GET_USER,
  payload: User
});

const setHtmlDocument = Document => ({
  type: ReduxActions.GET_HTML_DOCUMENT,
  payload: Document
});

const clearHtmlDocument = () => ({ type: ReduxActions.CLEAR_HTML_DOCUMENT });

export {
  setWindow,
  ResetRedux,
  setApiResponse,
  clearApiResponse,
  setUser,
  setHtmlDocument,
  clearHtmlDocument
};
