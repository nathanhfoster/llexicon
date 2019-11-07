import { ReduxActions } from "../../constants.js"
import { mergeJson } from "../../helpers"
const {
  ENTRIES_PENDING,
  ENTRIES_ERROR,
  ENTRY_IMPORT,
  ENTRIES_SET,
  ENTRIES_SET_BY_DATE,
  ENTRY_SET,
  ENTRY_POST,
  ENTRY_UPDATE,
  ENTRY_DELETE,
  REDUX_RESET
} = ReduxActions

const defaultState = {
  count: null,
  next: null,
  previous: null,
  items: [],
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
        items: mergeJson(payload, state.items),
        error: defaultState.error
      }
    case ENTRIES_SET:
      const { count, next, previous, results } = payload
      return {
        ...state,
        count,
        next,
        previous,
        items: mergeJson(results, state.items)
      }
    case ENTRIES_SET_BY_DATE:
      return { ...state, items: mergeJson(payload, state.items) }
    case ENTRY_SET:
      return {
        ...state,
        items: mergeJson([payload], state.items)
      }
    case ENTRY_POST:
      return {
        ...state,
        isPending: false,
        error: defaultState.error,
        items: state.items.map(item => (item.id === id ? payload : item))
        // [payload].concat(state.items.filter(item => item.id !== id))
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
