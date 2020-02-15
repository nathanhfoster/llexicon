import { AlertActionTypes } from "../Alerts/types"
import { EntriesActionTypes } from "../Entries/types"
import { PersisterActionTypes } from "../Persister/types"

const DEFAULT_STATE_PERSISTER = { lastUpdated: "", shouldDelay: true }

const Persister = (state = DEFAULT_STATE_PERSISTER, action) => {
  const { type, payload } = action
  switch (type) {
    case AlertActionTypes.ALERTS_CLEAR:
      return { ...state, lastUpdated: new Date(), shouldDelay: false }
    // Don't update component
    case EntriesActionTypes.ENTRY_IMPORT:
      return state
    case PersisterActionTypes.REDUX_PERSIST:
      return state
    // Catch all actions
    default:
      return { ...state, lastUpdated: new Date(), shouldDelay: true }
  }
}

export { DEFAULT_STATE_PERSISTER, Persister }
