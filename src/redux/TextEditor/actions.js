import { TextEditorActionTypes } from '../TextEditor/types'

const SetEditorState = payload => (dispatch, getState) => {
  const { title, html } = getState().TextEditor
  if (payload.title === undefined) payload.title = title
  if (!payload.html === undefined) payload.html = html
  dispatch({
    type: TextEditorActionTypes.TEXT_EDITOR_SET,
    payload,
  })
}

const ClearEditorState = () => ({
  type: TextEditorActionTypes.TEXT_EDITOR_CLEAR,
})

const SetBottomToolbarIsOpen = payload => ({
  type: TextEditorActionTypes.TEXT_EDITOR_SET_BOTTOM_TOOLBAR,
  payload,
})

export { SetEditorState, ClearEditorState, SetBottomToolbarIsOpen }
