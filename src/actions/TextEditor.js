import { ReduxActions } from "../constants"

const setEditorState = editorState => ({
  type: ReduxActions.TEXT_EDITOR_SET,
  payload: editorState
})

export { setEditorState }
