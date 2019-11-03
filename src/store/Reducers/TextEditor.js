import { ReduxActions } from "../../constants.js"
const { TEXT_EDITOR_SET, TEXT_EDITOR_CLEAR, REDUX_RESET } = ReduxActions

const defaultState = {
  clearedOn: "",
  title: "",
  editorStateHtml: "<p></p>",
  lastUpdated: ""
}

export const TextEditor = (state = defaultState, action) => {
  const { type, payload } = action
  switch (type) {
    case TEXT_EDITOR_SET:
      return { ...state, ...payload, lastUpdated: new Date() }
    case TEXT_EDITOR_CLEAR:
      return { ...defaultState, clearedOn: new Date() }
    case REDUX_RESET:
      return { ...defaultState, clearedOn: new Date() }
    default:
      return state
  }
}
