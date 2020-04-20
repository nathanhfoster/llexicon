import { AlertActionTypes } from "../Alerts/types"

const ClearAlerts = () => ({ type: AlertActionTypes.ALERTS_CLEAR })

const SetAlert = (payload) => ({
  type: AlertActionTypes.ALERTS_SET_MESSAGE,
  payload,
})

export { SetAlert, ClearAlerts }
