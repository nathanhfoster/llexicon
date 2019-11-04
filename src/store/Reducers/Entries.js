import { ReduxActions } from "../../constants.js"
const {
  ENTRIES_PENDING,
  ENTRIES_ERROR,
  ENTRY_IMPORT,
  ENTRIES_SET,
  ENTRIES_SET_BY_DATE,
  ENTRY_POST,
  ENTRY_UPDATE,
  ENTRY_DELETE,
  REDUX_RESET
} = ReduxActions

const defaultState = {
  items: [],
  itemsByDate: [],
  isPending: false,
  error: null
}

export const Entries = (state = defaultState, action) => {
  const { id, shouldDelete, type, payload } = action
  switch (type) {
    case ENTRIES_PENDING:
      return { ...state, isPending: true }
    case ENTRIES_ERROR:
      return { ...state, isPending: false, error: payload }
    case ENTRY_IMPORT:
      return {
        ...state,
        items: state.items.concat(payload),
        error: defaultState.error
      }
    case ENTRIES_SET:
      return { ...state, items: payload }
    case ENTRIES_SET_BY_DATE:
      return { ...state, itemsByDate: payload }
    case ENTRY_POST:
      const entryFound = state.items.findIndex(item => item.id === id) !== -1
      if (entryFound)
        return { ...state, isPending: false, error: defaultState.error }
      else
        return {
          ...state,
          isPending: false,
          error: defaultState.error,
          items: [payload].concat(state.items)
        }
    case ENTRY_UPDATE:
      return {
        ...state,
        isPending: false,
        error: defaultState.error,
        items: state.items.map((item, i) =>
          i === id || item.id === id
            ? {
                ...item,
                ...payload,
                lastUpdated: new Date(),
                shouldDelete
              }
            : item
        )
      }
    case ENTRY_DELETE:
      return { ...state, items: state.items.filter(item => item.id !== id) }
    case REDUX_RESET:
      return defaultState
    default:
      return state
  }
}
