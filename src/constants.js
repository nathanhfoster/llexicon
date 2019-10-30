const CookieMap = {
  USER_TOKEN: "User_Token",
  USER_LAST_LOGIN: "User_Last_Login"
}

const SocialAuthenticationProviders = {
  FACEBOOK: "Facebook",
  GOOGLE: "Google"
}

const ReduxActions = {
  USER_SET: "USER_SET",
  USER_SET_SETTINGS: "USER_SET_SETTINGS",

  SET_WINDOW: "SET_WINDOW",

  TEXT_EDITOR_SET: "TEXT_EDITOR_SET",
  TEXT_EDITOR_CLEAR: "TEXT_EDITOR_CLEAR",

  ENTRIES_SET: "ENTRIES_SET",
  ENTRY_IMPORT: "ENTRY_IMPORT",
  ENTRY_POST: "ENTRY_POST",
  ENTRY_UPDATE: "ENTRY_UPDATE",
  ENTRY_DELETE: "ENTRY_DELETE",

  REDUX_PERSIST: "REDUX_PERSIST",
  REDUX_RESET: "REDUX_RESET"
}
export { CookieMap, SocialAuthenticationProviders, ReduxActions }
