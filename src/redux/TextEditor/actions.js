import actions from '../actionTypes'

export const SetEditorState = payload => (dispatch, getState) => {
  const { title, html } = getState().TextEditor
  if (payload.title === undefined) payload.title = title
  if (!payload.html === undefined) payload.html = html
  dispatch({
    type: actions.TEXT_EDITOR_SET,
    payload,
  })
}

export const ClearEditorState = () => ({
  type: actions.TEXT_EDITOR_CLEAR,
})

export const SetBottomToolbarIsOpen = payload => ({
  type: actions.TEXT_EDITOR_SET_BOTTOM_TOOLBAR,
  payload,
})
