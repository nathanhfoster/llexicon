import { AlertActionTypes } from "../Alerts/types"
import { PersisterActionTypes } from "../Persister/types"
import { UserActionTypes } from "../User/types"

const DEFAULT_STATE_PERSISTER = { lastUpdated: "", shouldDelay: true }

const Persister = (state = DEFAULT_STATE_PERSISTER, action) => {
  const { type, payload } = action
  switch (type) {
    case UserActionTypes.USER_SET:
      return { ...state, lastUpdated: new Date(), shouldDelay: false }
    case AlertActionTypes.ALERTS_CLEAR:
      return { ...state, lastUpdated: new Date(), shouldDelay: false }
    // Don't update component
    case PersisterActionTypes.REDUX_PERSIST:
      return state
    // Catch all actions
    default:
      return { ...state, lastUpdated: new Date(), shouldDelay: true }
  }
}

export { DEFAULT_STATE_PERSISTER, Persister }
