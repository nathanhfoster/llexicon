import { AlertActionTypes } from "./types"
import { AppActionTypes } from "../App/types"

const DEFAULT_STATE_ALERTS = {
  apiResponseStatus: 404,
  title: "",
  message: "",
  timeout: 3000,
  serviceWorkerRegistration: null,
}

const Alerts = (state = DEFAULT_STATE_ALERTS, action) => {
  const { type, payload } = action
  switch (type) {
    case AlertActionTypes.ALERTS_SET_API_RESPONSE_STATUS:
      return { ...state, apiResponseStatus: payload }

    case AlertActionTypes.ALERTS_SET_MESSAGE:
      return { ...state, ...payload }

    case AlertActionTypes.ALERTS_CLEAR:
      return {
        ...DEFAULT_STATE_ALERTS,
        apiResponseStatus: state.apiResponseStatus,
      }

    case AppActionTypes.REDUX_RESET:
      return DEFAULT_STATE_ALERTS

    default:
      return state
  }
}

export { DEFAULT_STATE_ALERTS, Alerts }
