import actions from '../actionTypes'
import { defaultEntry } from '../Entries/utils'
import { getStringBytes } from '../../utils'

const defaultTextEditor = {
  ...defaultEntry,
  bottomToolbarIsOpen: true,
}

export const DEFAULT_STATE_TEXT_EDITOR = {
  ...defaultTextEditor,
  _size: getStringBytes(defaultTextEditor),
}

export const TextEditor = (state = DEFAULT_STATE_TEXT_EDITOR, action) => {
  const { type, payload } = action
  switch (type) {
    case actions.TEXT_EDITOR_SET:
      return { ...state, ...payload, _lastUpdated: new Date() }

    case actions.TEXT_EDITOR_SET_BOTTOM_TOOLBAR:
      return { ...state, bottomToolbarIsOpen: payload }

    case actions.TEXT_EDITOR_CLEAR:
      return {
        ...DEFAULT_STATE_TEXT_EDITOR,
        title: '',
        html: '<p><br/></p>',
        tags: [],
        people: [],
        EntryFiles: [],
        rating: 0,
        _clearedOn: new Date(),
      }

    case actions.REDUX_RESET:
      return {
        ...DEFAULT_STATE_TEXT_EDITOR,
        tags: [],
        EntryFiles: [],
        rating: 0,
        _clearedOn: new Date(),
      }

    case actions.LOAD_PERSISTED_STATE:
      return payload?.TextEditor || state

    default:
      return state
  }
}
