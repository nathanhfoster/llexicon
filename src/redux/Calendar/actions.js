import actions from '../actionTypes'

export const SetCalendar = payload => ({
  type: actions.CALENDAR_SET,
  payload,
})

export const SetCalendarActiveEntry = payload => ({
  type: actions.CALENDAR_SET_ACTIVE_ENTRY,
  payload,
})

export const ResetCalendarActiveEntry = () => dispatch => dispatch(SetCalendarActiveEntry({}))
