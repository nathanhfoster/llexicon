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
    show_footer: false,
    push_messages: false,
    offline_mode: false
  },
  location: {
    accuracy: null,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    latitude: null,
    longitude: null,
    speed: null,
    timestamp: null
  }
}

const User = (state = DEFAULT_STATE_USER, action) => {
  const { type, payload } = action
  switch (type) {
    case UserActionTypes.USER_SET:
      return {
        ...state,
        ...payload,
        updating: false,
        updated: true,
        error: null
      }
    case UserActionTypes.USER_SET_LOCATION:
      return { ...state, location: { ...state.location, ...payload } }
    case UserActionTypes.USER_RESET_LOCATION:
      return { ...state, location: DEFAULT_STATE_USER.location }
    case UserActionTypes.USER_SET_SETTINGS:
      return {
        ...state,
        Settings: { ...state.Settings, ...payload }
      }
    case AppActionTypes.REDUX_RESET:
      return DEFAULT_STATE_USER
    default:
      return state
  }
}

export { DEFAULT_STATE_USER, User }
