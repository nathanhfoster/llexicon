import { CalendarActionTypes } from "../Calendar/types"

const SetCalendar = payload => dispatch => {
  dispatch({
    type: CalendarActionTypes.CALENDAR_SET,
    payload
  })
}

export { SetCalendar }
