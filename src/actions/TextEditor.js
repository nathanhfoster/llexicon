import { ReduxActions } from "../constants"

const setEditorState = editorState => ({
  type: ReduxActions.TEXT_EDITOR_SET,
  payload: editorState
})

const clearEditorState = () => ({
  type: ReduxActions.TEXT_EDITOR_CLEAR
})

export { setEditorState, clearEditorState }
