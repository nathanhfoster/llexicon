import { TextEditorActionTypes } from "../TextEditor/types"
import { AppActionTypes } from "../App/types"

const DEFAULT_STATE_TEXT_EDITOR = {
  id: "NewEntry",
  clearedOn: "",
  title: "",
  html: "<p><br></p>",
  address: "",
  latitude: null,
  longitude: null,
  tags: [],
  rating: 0,
  _lastUpdated: "",
  EntryFiles: []
}

const TextEditor = (state = DEFAULT_STATE_TEXT_EDITOR, action) => {
  const { type, payload } = action
  switch (type) {
    case TextEditorActionTypes.TEXT_EDITOR_SET:
      return { ...state, ...payload, _lastUpdated: new Date() }
    case TextEditorActionTypes.TEXT_EDITOR_CLEAR:
      return { ...DEFAULT_STATE_TEXT_EDITOR, clearedOn: new Date() }
    case AppActionTypes.REDUX_RESET:
      return { ...DEFAULT_STATE_TEXT_EDITOR, clearedOn: new Date() }
    default:
      return state
  }
}

export { DEFAULT_STATE_TEXT_EDITOR, TextEditor }
