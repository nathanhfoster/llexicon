import actions from '../actionTypes'

export const DEFAULT_STATE_CALENDAR = {
  activeDate: new Date(),
  view: 'month',
  activeEntry: {},
}

export const Calendar = (state = DEFAULT_STATE_CALENDAR, action) => {
  const { type, payload } = action
  switch (type) {
    case actions.CALENDAR_SET:
      return { ...state, ...payload }

    case actions.CALENDAR_SET_ACTIVE_ENTRY:
      return { ...state, activeEntry: payload }

    // case actions.LOAD_PERSISTED_STATE:
    //   return payload?.Calendar || state

    default:
      return state
  }
}
