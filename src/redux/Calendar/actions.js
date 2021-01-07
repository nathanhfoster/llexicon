import { CalendarActionTypes } from "../Calendar/types"
const { CALENDAR_SET, CALENDAR_SET_ACTIVE_ENTRY } = CalendarActionTypes

const SetCalendar = (payload) => ({
  type: CALENDAR_SET,
  payload,
})

const SetCalendarActiveEntry = (payload) => ({
  type: CALENDAR_SET_ACTIVE_ENTRY,
  payload,
})

const ResetCalendarActiveEntry = () => (dispatch) =>
  dispatch(SetCalendarActiveEntry({}))

export { SetCalendar, SetCalendarActiveEntry, ResetCalendarActiveEntry }
