import { ReduxActions } from "../constants"

const SetEditorState = payload => (dispatch, getState) => {
  const { title, html } = getState().TextEditor
  if (payload.title === undefined) payload.title = title
  if (!payload.html === undefined) payload.html = html
  dispatch({
    type: ReduxActions.TEXT_EDITOR_SET,
    payload
  })
}

const ClearEditorState = () => ({
  type: ReduxActions.TEXT_EDITOR_CLEAR
})

export { SetEditorState, ClearEditorState }
