import { ReduxActions } from "../../constants.js"
import { mergeJson } from "../../helpers"
const {
  ENTRIES_SET_TAGS,
  ENTRIES_PENDING,
  ENTRIES_ERROR,
  ENTRIES_COMPLETE,
  ENTRY_IMPORT,
  ENTRIES_SET,
  ENTRIES_SET_BY_DATE,
  ENTRY_SET,
  ENTRY_POST,
  ENTRY_UPDATE,
  ENTRY_DELETE,
  REDUX_RESET,
  ENTRIES_SEARCH_FILTER
} = ReduxActions

const DEFAULT_STATE_ENTRIES = {
  count: null,
  next: null,
  previous: null,
  items: [],
  filteredItems: [],
  isPending: false,
  error: null,
  search: "",
  EntryTags: []
}

const handleFilterEntries = (entries, search) => {
  if (!search) return { items: entries, filteredItems: [] }
  const searchValue = search.toUpperCase()
  let cachedFilteredEntries = []

  const filteredEntries = entries.filter(item => {
    const { title, html, tags, address } = item
    if (
      tags.map(tag => tag.title.toUpperCase()).includes(searchValue) ||
      title.toUpperCase().includes(searchValue) ||
      html.toUpperCase().includes(searchValue) ||
      address.toUpperCase().includes(searchValue)
    ) {
      return true
    } else {
      cachedFilteredEntries.push(item)
      return false
    }
  })

  return {
    filteredItems: cachedFilteredEntries,
    items: filteredEntries
  }
}

const Entries = (state = DEFAULT_STATE_ENTRIES, action) => {
  const { id, replaceKey, type, payload, search, _lastUpdated } = action
  switch (type) {
    case ENTRIES_SET_TAGS:
      return { ...state, EntryTags: payload }

    case ENTRIES_SEARCH_FILTER:
      return {
        ...state,
        ...handleFilterEntries(
          mergeJson(state.items.concat(state.filteredItems), payload),
          search
        ),
        search
      }
    case ENTRIES_PENDING:
      return { ...state, isPending: true }
    case ENTRIES_ERROR:
      return { ...state, isPending: false, error: payload }
    case ENTRIES_COMPLETE:
      return { ...state, isPending: false, error: DEFAULT_STATE_ENTRIES.error }
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
        ...handleFilterEntries(
          mergeJson(state.items.concat(state.filteredItems), results),
          state.search
        )
      }
    case ENTRIES_SET_BY_DATE:
      return {
        ...state,
        ...handleFilterEntries(
          mergeJson(state.items.concat(state.filteredItems), payload),
          state.search
        )
      }
    case ENTRY_SET:
      return {
        ...state,
        ...handleFilterEntries(
          mergeJson(state.items.concat(state.filteredItems), [payload]),
          state.search
        )
      }
    case ENTRY_POST:
      return {
        ...state,
        isPending: false,
        error: DEFAULT_STATE_ENTRIES.error,
        ...handleFilterEntries(
          state.items
            .concat(state.filteredItems)
            .map(item => (item.id === id ? payload : item)),
          state.search
        )
      }
    case ENTRY_UPDATE:
      return {
        ...state,
        isPending: false,
        error: DEFAULT_STATE_ENTRIES.error,
        ...handleFilterEntries(
          state.items.concat(state.filteredItems).map(item =>
            item.id === id
              ? {
                  ...item,
                  ...payload,
                  _lastUpdated
                }
              : item
          ),
          state.search
        )
      }

    case ENTRY_DELETE:
      return {
        ...state,
        ...handleFilterEntries(
          state.items
            .concat(state.filteredItems)
            .filter(item => item.id !== id),
          state.search
        )
      }
    case REDUX_RESET:
      return DEFAULT_STATE_ENTRIES
    default:
      return state
  }
}

export { DEFAULT_STATE_ENTRIES, Entries }
