import { CalendarActionTypes } from "../Calendar/types"

const DEFAULT_STATE_CALENDAR = { activeDate: new Date(), view: "month" }

const Calendar = (state = DEFAULT_STATE_CALENDAR, action) => {
  const { type, payload } = action
  switch (type) {
    // Don't update component
    case CalendarActionTypes.CALENDAR_SET:
      return { ...state, ...payload }
    // Catch all actions
    default:
      return state
  }
}

export { DEFAULT_STATE_CALENDAR, Calendar }
