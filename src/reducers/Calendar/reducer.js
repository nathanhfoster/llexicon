import { CalendarActionTypes } from "./types"

const DEFAULT_STATE_CALENDAR = { activeDate: new Date(), view: "month" }

const Calendar = (state = DEFAULT_STATE_CALENDAR, action) => {
  const { type, payload } = action
  switch (type) {
    case CalendarActionTypes.CALENDAR_SET:
      return { ...state, ...payload }

    default:
      return state
  }
}

export { DEFAULT_STATE_CALENDAR, Calendar }
