import actions from '../actionTypes'

export const DEFAULT_STATE_ALERTS = {
  apiResponseStatus: 404,
  title: '',
  message: '',
  timeout: 3000,
  serviceWorkerRegistration: null,
}

export const Alerts = (state = DEFAULT_STATE_ALERTS, action) => {
  const { type, payload } = action
  switch (type) {
    case actions.ALERTS_SET_API_RESPONSE_STATUS:
      return { ...state, apiResponseStatus: payload }

    case actions.ALERTS_SET_MESSAGE:
      return { ...state, ...payload }

    case actions.ALERTS_CLEAR:
      return {
        ...DEFAULT_STATE_ALERTS,
        apiResponseStatus: state.apiResponseStatus,
      }

    case actions.REDUX_RESET:
      return DEFAULT_STATE_ALERTS

    case actions.LOAD_PERSISTED_STATE:
      return { ...state, ...payload.Alerts, timeout: DEFAULT_STATE_ALERTS.timeout }

    default:
      return state
  }
}
