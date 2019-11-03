import { ReduxActions } from "../constants"
const { ALERTS_SET_MESSAGE, ALERTS_CLEAR } = ReduxActions

const ClearAlerts = () => ({ type: ALERTS_CLEAR })

export { ClearAlerts }
