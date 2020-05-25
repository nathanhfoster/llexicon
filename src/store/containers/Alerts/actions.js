import { AlertActionTypes } from "../Alerts/types"

const SetApiResponseStatus = (payload) => ({
  type: AlertActionTypes.ALERTS_SET_API_RESPONSE_STATUS,
  payload,
})

const SetAlert = (payload) => ({
  type: AlertActionTypes.ALERTS_SET_MESSAGE,
  payload,
})

const ClearAlerts = () => ({ type: AlertActionTypes.ALERTS_CLEAR })

export { SetApiResponseStatus, SetAlert, ClearAlerts }
