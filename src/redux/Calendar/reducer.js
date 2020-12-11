import { AppActionTypes } from "redux/App/types"
import { CalendarActionTypes } from "../Calendar/types"
import { from } from "form-data"

const { CALENDAR_SET, CALENDAR_SET_ACTIVE_ENTRY } = CalendarActionTypes

const DEFAULT_STATE_CALENDAR = {
  activeDate: new Date(),
  view: "month",
  activeEntry: {},
}

const Calendar = (state = DEFAULT_STATE_CALENDAR, action) => {
  const { type, payload } = action
  switch (type) {
    case CALENDAR_SET:
      return { ...state, ...payload }

    case CALENDAR_SET_ACTIVE_ENTRY:
      return { ...state, activeEntry: payload }

    // case AppActionTypes.LOAD_PERSISTED_STATE:
    //   return payload?.Calendar || state

    default:
      return state
  }
}

export { DEFAULT_STATE_CALENDAR, Calendar }
