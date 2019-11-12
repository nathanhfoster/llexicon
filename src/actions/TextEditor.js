import { ReduxActions } from "../constants"

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

const ClearEditorState = () => ({
  type: ReduxActions.TEXT_EDITOR_CLEAR
})

export { SetEditorState, ClearEditorState }
