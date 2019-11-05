import { ReduxActions } from "../../constants.js"
const { CALENDAR_SET } = ReduxActions

const defaultState = { activeDate: new Date() }

export const Calendar = (state = defaultState, action) => {
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
