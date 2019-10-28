import { ReduxActions } from "../../constants.js"

const defaultState = {
  clearedOn: "",
  title: "",
  editorStateHtml: "<p></p>",
  lastUpdated: ""
}

export const TextEditor = (state = defaultState, action) => {
  const { type, payload } = action
  switch (type) {
    case ReduxActions.TEXT_EDITOR_SET:
      return { ...state, ...payload, lastUpdated: new Date() }
    case ReduxActions.TEXT_EDITOR_CLEAR:
      return { ...defaultState, clearedOn: new Date() }
    case ReduxActions.RESET_REDUX:
      return { ...defaultState, clearedOn: new Date() }
    default:
      return state
  }
}
