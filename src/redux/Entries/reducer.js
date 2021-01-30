import actions from '../actionTypes'
import { FIRST_JOUNRAL_ENTRY, mergeJson, getMostRecent, handleFilterEntries } from './utils'
import { getStringBytes } from '../../utils'
import { isObject } from 'utils'

export const DEFAULT_STATE_ENTRIES = {
  count: null,
  next: null,
  previous: null,
  item: { id: null, isPending: false },
  items: [FIRST_JOUNRAL_ENTRY],
  selectedItemsMap: {},
  filteredItems: [],
  isPending: false,
  error: null,
  search: '',
  EntryTags: [
    {
      name: 'Family',
    },
    {
      name: 'Friends',
    },
    {
      name: 'Document',
    },
    {
      name: 'Link',
    },
    {
      name: 'Music',
    },
    {
      name: 'Vacation',
    },
    {
      name: 'Video',
    },
  ],
  EntryPeople: [
    {
      name: 'Me',
    },
  ],
  sortMap: {
    date_updated: true,
  },
  filterMap: {},
  showOnlyPublic: false,
}

export const Entries = (state = DEFAULT_STATE_ENTRIES, action) => {
  const { type, payload, search, isPending } = action

  let nextItem
  let nextItems = []
  let nextSelectedItemsMap = {}

  switch (type) {
    case actions.ENTRIES_TOGGLE_SHOW_ONLY_PUBLIC:
      return { ...state, showOnlyPublic: !state.showOnlyPublic }

    case actions.ENTRIES_SET_TAGS:
      return {
        ...state,
        EntryTags: mergeJson(state.EntryTags, payload, 'name'),
      }

    case actions.ENTRIES_SET_PEOPLE:
      return { ...state, EntryPeople: payload }

    case actions.ENTRIES_SEARCH_FILTER:
      if (!payload) return { ...state, search }

      return {
        ...state,
        ...handleFilterEntries(mergeJson(state.items.concat(state.filteredItems), payload), search),
        search,
        isPending,
      }

    case actions.ENTRIES_PENDING:
      return { ...state, isPending: true }

    case actions.ENTRY_PENDING:
      return { ...state, item: { ...state.item, isPending: true } }

    case actions.ENTRIES_ERROR:
      return { ...state, isPending: false, error: payload }

    case actions.ENTRIES_ERROR_CLEAR:
      return { ...state, isPending: false, error: DEFAULT_STATE_ENTRIES.error }

    case actions.ENTRIES_COMPLETE:
      return { ...state, isPending: false, error: DEFAULT_STATE_ENTRIES.error }

    case actions.ENTRY_CLEAR:
      return { ...state, item: DEFAULT_STATE_ENTRIES.item }

    case actions.ENTRIES_CLEAR:
      return {
        ...state,
        item: DEFAULT_STATE_ENTRIES.item,
        items: [],
        filteredItems: [],
        selectedItemsMap: DEFAULT_STATE_ENTRIES.selectedItemsMap,
      }

    case actions.ENTRIES_SET:
      const { count, next, previous, results } = payload
      return {
        ...state,
        ...handleFilterEntries(
          mergeJson(state.items.concat(state.filteredItems), results || payload),
          state.search,
        ),
        count: count || state.count,
        next: next || state.next,
        previous: previous || state.previous,
        isPending: false,
        error: DEFAULT_STATE_ENTRIES.error,
      }

    case actions.ENTRY_SET:
      nextItem = { ...state.item, ...payload, isPending: false }
      nextItem = { ...nextItem, _size: getStringBytes(nextItem) }

      return {
        ...state,
        ...handleFilterEntries(
          mergeJson(state.items.concat(state.filteredItems), [nextItem]),
          state.search,
        ),
        item: {
          ...(!state.item.id || nextItem.id == state.item.id
            ? getMostRecent(state.item, nextItem)
            : state.item),
          isPending: false,
        },
        isPending: false,
      }

    case actions.ENTRIES_UPDATE:
      nextSelectedItemsMap = { ...state.nextSelectedItemsMap }
      nextItems = state.items.concat(state.filteredItems).map(e => {
        if (payload.id === e.id) {
          nextItem = { ...e, ...payload }
          nextItem = {
            ...nextItem,
            _size: getStringBytes(nextItem),
          }
          return nextItem
        } else if (payload[e.id]) {
          nextItem = { ...e, ...payload[e.id] }
          nextItem = {
            ...nextItem,
            _size: getStringBytes(nextItem),
          }
          return nextItem
        }

        return e
      })

      return {
        ...state,
        ...handleFilterEntries(nextItems, state.search),
        selectedItemsMap: nextSelectedItemsMap,
        item: {
          ...(payload?.id == state.item.id
            ? getMostRecent(state.item, { ...state.item, ...payload })
            : payload[state.item.id]
            ? getMostRecent(state.item, {
                ...state.item,
                ...payload[state.item.id],
              })
            : state.item),
          isPending: false,
        },
        isPending: false,
        error: DEFAULT_STATE_ENTRIES.error,
      }

    case actions.ENTRIES_SELECTED:
      return {
        ...state,
        selectedItemsMap: payload,
      }

    case actions.ENTRIES_DELETE:
      nextSelectedItemsMap = { ...state.nextSelectedItemsMap }
      return {
        ...state,
        ...handleFilterEntries(
          state.items.concat(state.filteredItems).filter(({ id }) => {
            if (nextSelectedItemsMap[id]) {
              delete nextSelectedItemsMap[id]
            }
            return isObject(payload) ? payload[id] === undefined : id !== payload
          }),
          state.search,
        ),
        selectedItemsMap: nextSelectedItemsMap,
      }

    case actions.ENTRIES_RESET_SORT_AND_FILTER_MAP:
      return {
        ...state,
        sortMap: DEFAULT_STATE_ENTRIES.sortMap,
        filterMap: DEFAULT_STATE_ENTRIES.filterMap,
        item: DEFAULT_STATE_ENTRIES.item,
      }

    case actions.ENTRIES_SET_SORT_MAP:
      const { sortKey, sortUp } = payload
      return {
        ...state,
        sortMap: { ...state.sortMap, [sortKey]: sortUp },
      }

    case actions.ENTRIES_SET_FILTER_MAP:
      const { filterKey, searchValue } = payload
      return {
        ...state,
        filterMap: {
          ...state.filterMap,
          [filterKey]: searchValue,
        },
      }

    case actions.REDUX_RESET:
      return {
        ...DEFAULT_STATE_ENTRIES,
        items: state.items
          .concat(state.filteredItems)
          .filter(
            ({ _shouldDelete, _shouldPost, _lastUpdated }) =>
              _shouldDelete || _shouldPost || _lastUpdated,
          ),
      }

    case actions.LOAD_PERSISTED_STATE:
      nextItems =
        payload.Entries?.items.concat(payload.Entries?.filteredItems) ||
        state.items.concat(state.filteredItems)

      return {
        ...state,
        ...payload.Entries,
        ...handleFilterEntries(nextItems, payload.Entries?.search || state.search),
        item: DEFAULT_STATE_ENTRIES.item,
        isPending: DEFAULT_STATE_ENTRIES.isPending,
        error: DEFAULT_STATE_ENTRIES.error,
        // search: DEFAULT_STATE_ENTRIES.search
      }

    default:
      return state
  }
}
