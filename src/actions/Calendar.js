import { ReduxActions } from "../constants"
const { CALENDAR_SET } = ReduxActions

const SetCalendar = payload => dispatch => {
  dispatch({
    type: CALENDAR_SET,
    payload
  })
}

export { SetCalendar }
