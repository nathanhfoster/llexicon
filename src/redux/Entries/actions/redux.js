import actions from '../../actionTypes'
import { getReduxEntryId } from '../utils'
import { getStringBytes, isObject } from 'utils'

export const PendingEntries = () => ({ type: actions.ENTRIES_PENDING })

export const PendingEntry = () => ({ type: actions.ENTRY_PENDING })

export const SetEntriesComplete = () => ({ type: actions.ENTRIES_COMPLETE })

export const SetEntriesError = e => {
  const payload = JSON.parse(JSON.stringify(e))
  return { type: actions.ENTRIES_ERROR, payload }
}

export const ClearEntriesErrors = () => ({ type: actions.ENTRIES_ERROR_CLEAR })

export const SetEntry = payload => ({
  type: actions.ENTRY_SET,
  payload,
})

export const PostReduxEntry = entry => dispatch => {
  const payload = {
    ...entry,
    id: getReduxEntryId(),
    _shouldPost: true,
    _lastUpdated: null,
    date_created: entry.date_created_by_author,
    date_updated: entry.date_created_by_author,
  }

  const size = getStringBytes(payload)

  return dispatch(
    SetEntry({
      ...payload,
      size,
      _size: size,
    }),
  )
}

export const UpdateReduxEntries = (entryOrEntriesMap, _lastUpdated = new Date()) => ({
  type: actions.ENTRIES_UPDATE,
  payload: entryOrEntriesMap.id ? { ...entryOrEntriesMap, _lastUpdated } : entryOrEntriesMap,
})

export const SelectReduxEntries = (selectedEntriesMap = {}) => ({
  type: actions.ENTRIES_SELECTED,
  payload: selectedEntriesMap || {},
})

export const ClearEntry = () => ({ type: actions.ENTRY_CLEAR })

export const ClearEntries = () => ({ type: actions.ENTRIES_CLEAR })

export const DeleteReduxEntries = entriesToDelete => ({
  type: actions.ENTRIES_DELETE,
  payload: entriesToDelete,
})

export const SetEntries = payload => ({
  type: actions.ENTRIES_SET,
  payload,
})

export const SetEntriesTags = payload => ({
  type: actions.ENTRIES_SET_TAGS,
  payload,
})

export const SetEntriesPeople = payload => ({
  type: actions.ENTRIES_SET_PEOPLE,
  payload,
})

export const SetSearchEntries = (search, payload, isPending = true) => ({
  type: actions.ENTRIES_SEARCH_FILTER,
  payload,
  search,
  isPending,
})

export const SetEntriesSortMap = (sortKey, sortUp) => ({
  type: actions.ENTRIES_SET_SORT_MAP,
  payload: { sortKey, sortUp },
})

export const SetEntriesFilterMap = (filterKey, searchValue) => ({
  type: actions.ENTRIES_SET_FILTER_MAP,
  payload: { filterKey, searchValue },
})

export const ToggleShowOnlyPublic = () => ({
  type: actions.ENTRIES_TOGGLE_SHOW_ONLY_PUBLIC,
})

export const ResetEntriesSortAndFilterMaps = () => ({
  type: actions.ENTRIES_RESET_SORT_AND_FILTER_MAP,
})

export const SetTableColumns = (payload) => ({
  type: actions.ENTRIES_SET_TABLE_COLUMNS,
  payload,
})

export const ResetSearchEntries = () => dispatch => dispatch(SetSearchEntries('', [], false))

export const DeleteEntryFileFromRedux = (id, entry_id) => (dispatch, getState) => {
  const { items, filteredItems } = getState().Entries
  const entryToUpdate = (filteredItems.length > 0 ? items.concat(filteredItems) : items).find(
    ({ id }) => id == entry_id,
  )

  if (entryToUpdate) {
    const payload = {
      EntryFiles: entryToUpdate.EntryFiles.filter(file => file.id !== id),
    }
    dispatch(UpdateReduxEntries(payload))
  }
}
