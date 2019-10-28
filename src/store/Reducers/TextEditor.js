import { ReduxActions } from "../../constants.js"

const defaultState = { editorStateHtml: "<p></p>" }

export const TextEditor = (state = defaultState, action) => {
  const { type, payload } = action
  switch (type) {
    case ReduxActions.TEXT_EDITOR_SET:
      return { ...state, editorStateHtml: payload }
    case ReduxActions.RESET_REDUX:
      return defaultState
    default:
      return state
  }
}
