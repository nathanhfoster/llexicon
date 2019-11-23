import { ReduxActions } from "../../constants.js"
import { mergeJson } from "../../helpers"
import deepEquals from "../../helpers/deepEquals"
const {
  ENTRIES_PENDING,
  ENTRIES_ERROR,
  ENTRY_IMPORT,
  ENTRIES_SET,
  ENTRIES_SET_BY_DATE,
  ENTRY_SET,
  ENTRY_POST,
  ENTRY_UPDATE,
  ENTRY_UPDATE_IMAGE,
  ENTRY_DELETE,
  REDUX_RESET,
  ENTRIES_SEARCH_FOCUS,
  ENTRIES_SEARCH_FILTER
} = ReduxActions

const DEFAULT_STATE_ENTRIES = {
  count: null,
  next: null,
  previous: null,
  items: [],
  originalItems: [],
  isPending: false,
  error: null
}

const Entries = (state = DEFAULT_STATE_ENTRIES, action) => {
  const {
    id,
    replaceKey,
    shouldDelete,
    lastUpdated,
    type,
    payload,
    search
  } = action
  switch (type) {
    case ENTRIES_SEARCH_FOCUS:
      const { originalItems, items } = state
      if (
        originalItems.length < items ||
        (originalItems.length === items && !deepEquals(originalItems, items))
      )
        return { ...state, originalItems: items }
    case ENTRIES_SEARCH_FILTER:
      return {
        ...state,
        items: mergeJson(state.items, payload).filter(item => {
          const { title, html, tags } = item
          return (
            title.toLowerCase().includes(search.toLowerCase()) ||
            html.toLowerCase().includes(search.toLowerCase()) ||
            tags.map(tag => tag.toLowerCase()).includes(search.toLowerCase())
          )
        })
      }
    case ENTRIES_PENDING:
      return { ...state, isPending: true }
    case ENTRIES_ERROR:
      return { ...state, isPending: false, error: payload }
    case ENTRY_IMPORT:
      return {
        ...state,
        items: mergeJson(state.items, payload),
        error: DEFAULT_STATE_ENTRIES.error
      }
    case ENTRIES_SET:
      const { count, next, previous, results } = payload
      return {
        ...state,
        count,
        next,
        previous,
        items: mergeJson(state.items, results)
      }
    case ENTRIES_SET_BY_DATE:
      return { ...state, items: mergeJson(state.items, payload) }
    case ENTRY_SET:
      return {
        ...state,
        items: mergeJson(state.items, [payload])
      }
    case ENTRY_POST:
      return {
        ...state,
        isPending: false,
        error: DEFAULT_STATE_ENTRIES.error,
        items: state.items.map(item => (item.id === id ? payload : item))
        // [payload].concat(state.items.filter(item => item.id !== id))
      }
    case ENTRY_UPDATE:
      return {
        ...state,
        isPending: false,
        error: DEFAULT_STATE_ENTRIES.error,
        items: state.items.map(item =>
          item.id === id
            ? {
                ...item,
                ...payload,
                lastUpdated,
                shouldDelete
              }
            : item
        )
      }

    case ENTRY_UPDATE_IMAGE:
      return {
        ...state,
        items: state.items.map(item => {
          const { html } = item
          const hasImage = html.includes(replaceKey)

          if (hasImage) {
            return {
              ...item,
              html: html.replace(replaceKey, payload),
              shouldPost: false,
              lastUpdated: new Date()
            }
          } else return item
        })
      }

    case ENTRY_DELETE:
      return { ...state, items: state.items.filter(item => item.id !== id) }
    case REDUX_RESET:
      return DEFAULT_STATE_ENTRIES
    default:
      return state
  }
}

export { DEFAULT_STATE_ENTRIES, Entries }
