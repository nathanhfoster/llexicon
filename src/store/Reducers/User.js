import { ReduxActions } from "../../constants.js";

const defaultState = {
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
  bio: null,
  opt_in: null,
  date_joined: null,
  location: null,
  university: null,
  degrees: [],
  profile_uri: null,
  job_title: null,
  SocialAuthentication: [],
  groups: [],
  user_permissions: [],
  Settings: { show_footer: false, push_messages: false }
};

export const User = (state = defaultState, action) => {
  const { type, payload } = action;
  switch (type) {
    case ReduxActions.USER_SET:
      return { ...state, ...payload };
    case ReduxActions.USER_SET_SOCIAL_AUTHENTICATION:
      return {
        ...state,
        SocialAuthentication: payload
      };
    case ReduxActions.USER_UPDATE_LOADING:
      return {
        ...state,
        updating: true,
        updated: false
      };
    case ReduxActions.USER_UPDATE_SUCCESS:
      return {
        ...state,
        ...payload,
        updating: false,
        updated: true,
        error: null
      };
    case ReduxActions.USER_CLEAR_API:
      return {
        ...state,
        posting: false,
        posted: false,
        updating: false,
        updated: false,
        error: null
      };
    case ReduxActions.USER_SET_SETTINGS:
      return {
        ...state,
        Settings: payload
      };
    case ReduxActions.USER_SET_LOGOUT:
      return defaultState;
    case ReduxActions.RESET_REDUX:
      return defaultState;
    default:
      return { ...state };
  }
};
