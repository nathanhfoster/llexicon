import { ReduxActions } from "../constants"
import { getState } from "../store/persist"

const SetEditorState = payload => (dispatch, getState) => {
  const { title, editorStateHtml } = getState().TextEditor
  if (!payload.title) payload.title = title
  if (!payload.editorStateHtml) payload.editorStateHtml = editorStateHtml
  dispatch({
    type: ReduxActions.TEXT_EDITOR_SET,
    payload
  })
}

const clearEditorState = () => ({
  type: ReduxActions.TEXT_EDITOR_CLEAR
})

export { SetEditorState, clearEditorState }
