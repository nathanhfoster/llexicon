import { AlertActionTypes } from "../Alerts/types"
import { ReduxActionTypes } from "../Actions/types"

const DEFAULT_STATE_ALERTS = {
  title: "",
  message: ""
}

const Alerts = (state = DEFAULT_STATE_ALERTS, action) => {
  const { type, payload } = action
  switch (type) {
    case AlertActionTypes.ALERTS_SET_MESSAGE:
      return { ...state, ...payload }
    case AlertActionTypes.ALERTS_CLEAR:
      return DEFAULT_STATE_ALERTS
    case ReduxActionTypes.REDUX_RESET:
      return DEFAULT_STATE_ALERTS
    default:
      return state
  }
}

export { DEFAULT_STATE_ALERTS, Alerts }
