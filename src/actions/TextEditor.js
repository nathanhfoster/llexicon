import { ReduxActions } from "../constants"

const SetEditorState = editorState => ({
  type: ReduxActions.TEXT_EDITOR_SET,
  payload: editorState
})

const clearEditorState = () => ({
  type: ReduxActions.TEXT_EDITOR_CLEAR
})

export { SetEditorState, clearEditorState }
