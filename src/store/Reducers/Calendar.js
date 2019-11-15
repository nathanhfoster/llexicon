import { ReduxActions } from "../../constants.js"
const { CALENDAR_SET } = ReduxActions

const DEFAULT_STATE_CALENDAR = { activeDate: new Date(), view: "month" }

const Calendar = (state = DEFAULT_STATE_CALENDAR, action) => {
  const { type, payload } = action
  switch (type) {
    // Don't update component
    case CALENDAR_SET:
      return { ...state, ...payload }
    // Catch all actions
    default:
      return state
  }
}

export { DEFAULT_STATE_CALENDAR, Calendar }
