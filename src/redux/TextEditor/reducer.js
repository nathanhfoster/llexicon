import { TextEditorActionTypes } from "../TextEditor/types"
import { AppActionTypes } from "../App/types"
import { DEFAULT_ENTRY_FILES } from "../Entries/reducer"

const DEFAULT_STATE_TEXT_EDITOR = {
  clearedOn: "",
  author: null,
  id: "NewEntry",
  tags: [
    {
      name: "Excited",
    },
    {
      name: "Inspired",
    },
  ],
  people: [],
  EntryFiles: DEFAULT_ENTRY_FILES,
  title: "",
  html: "<p><br></p>",
  date_created: null,
  date_created_by_author: null,
  date_updated: null,
  views: 0,
  rating: 5,
  address: null,
  latitude: null,
  longitude: null,
  is_public: false,

  // Redux Only
  _shouldDelete: false,
  _shouldPost: true,
  _lastUpdated: null,
}

const TextEditor = (state = DEFAULT_STATE_TEXT_EDITOR, action) => {
  const { type, payload } = action
  switch (type) {
    case TextEditorActionTypes.TEXT_EDITOR_SET:
      return { ...state, ...payload, _lastUpdated: new Date() }

    case TextEditorActionTypes.TEXT_EDITOR_CLEAR:
      return { ...DEFAULT_STATE_TEXT_EDITOR, tags: [], EntryFiles: [], rating: 0, clearedOn: new Date() }

    case AppActionTypes.REDUX_RESET:
      return { ...DEFAULT_STATE_TEXT_EDITOR, tags: [], EntryFiles: [], rating: 0, clearedOn: new Date() }

    default:
      return state
  }
}

export { DEFAULT_STATE_TEXT_EDITOR, TextEditor }
