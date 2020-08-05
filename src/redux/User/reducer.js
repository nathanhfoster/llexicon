import { UserActionTypes } from "./types"
import { AppActionTypes } from "../App/types"

const DEFAULT_STATE_USER = {
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

const User = (state = DEFAULT_STATE_USER, action) => {
  const { type, payload } = action
  switch (type) {
    case UserActionTypes.USER_PENDING:
      return { ...state, pending: true }

    case UserActionTypes.USER_ERROR:
      return { ...state, error: payload }

    case UserActionTypes.USER_RESET_ERROR:
      return { ...state, error: DEFAULT_STATE_USER.error }

    case UserActionTypes.USER_SET:
      return {
        ...state,
        ...payload,
        pending: false,
        error: null,
      }

    case UserActionTypes.USER_SET_LOCATION:
      return { ...state, location: { ...state.location, ...payload } }

    case UserActionTypes.USER_RESET_LOCATION:
      return { ...state, location: DEFAULT_STATE_USER.location }

    case UserActionTypes.USER_SET_SETTINGS:
      return {
        ...state,
        Settings: { ...state.Settings, ...payload },
        pending: false,
        error: null,
      }

    case AppActionTypes.REDUX_RESET:
      return DEFAULT_STATE_USER

    default:
      return state
  }
}

export { DEFAULT_STATE_USER, User }
