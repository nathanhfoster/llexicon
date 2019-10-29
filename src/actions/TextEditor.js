import { ReduxActions } from "../constants"
import { getState } from "../store/Persister/persist"

const SetEditorState = payload => (dispatch, getState) => {
  const { title, editorStateHtml } = getState().TextEditor
  if (payload.title === undefined) payload.title = title
  if (!payload.editorStateHtml === undefined)
    payload.editorStateHtml = editorStateHtml
  dispatch({
    type: ReduxActions.TEXT_EDITOR_SET,
    payload
  })
}

const clearEditorState = () => ({
  type: ReduxActions.TEXT_EDITOR_CLEAR
})

export { SetEditorState, clearEditorState }
