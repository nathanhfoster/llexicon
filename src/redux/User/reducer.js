import actions from '../actionTypes'

export const DEFAULT_STATE_USER = {
  token: null,
  id: null,
  picture: null,
  username: null,
  email: null,
  first_name: null,
  last_name: null,
  is_superuser: null,
  is_staff: null,
  is_active: null,
  last_login: null,
  opt_in: null,
  date_joined: null,
  SocialAuthentications: [],
  groups: [],
  user_permissions: [],
  Settings: {
    show_animated_background: true,
    push_messages: false,
    offline_mode: false,
    dark_mode: true,
  },
  location: {
    accuracy: null,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    latitude: null,
    longitude: null,
    speed: null,
    timestamp: null,
  },
  pending: false,
  error: null,
}

export const User = (state = DEFAULT_STATE_USER, action) => {
  const { type, payload } = action

  switch (type) {
    case actions.USER_PENDING:
      return { ...state, pending: payload }

    case actions.USER_ERROR:
      return { ...state, error: payload, pending: false }

    case actions.USER_RESET_ERROR:
      return { ...state, error: DEFAULT_STATE_USER.error }

    case actions.USER_SET:
      return {
        ...state,
        ...payload,
        pending: false,
        error: null,
      }

    case actions.USER_SET_LOCATION:
      return { ...state, location: { ...state.location, ...payload } }

    case actions.USER_RESET_LOCATION:
      return { ...state, location: DEFAULT_STATE_USER.location }

    case actions.USER_SET_SETTINGS:
      return {
        ...state,
        Settings: { ...state.Settings, ...payload },
        pending: false,
        error: null,
      }

    case actions.REDUX_RESET:
      return DEFAULT_STATE_USER

    // case actions.LOAD_PERSISTED_STATE:
    //   return payload?.User || state

    default:
      return state
  }
}
