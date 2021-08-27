import { Entries } from "views"
import { BasicTableActionTypes } from "./types"

const {
  BASIC_TABLE_SORT,
  BASIC_TABLE_FILTER,
  BASIC_TABLE_SET_PAGE,
  BASIC_TABLE_SET_PAGE_SIZE,
  BASIC_TABLE_SET_DATA,
  BASIC_TABLE_SET_SELECTED_DATA,
  BASIC_TABLE_SELECT_DATA_ITEMS,
  BASIC_TABLE_SET_COLUMNS,
} = BasicTableActionTypes

export const basicTableSort = (onSortCallback, sortKey, sortUp) => (
  dispatch
) => {
  onSortCallback && onSortCallback(sortKey, sortUp)
  const payload = { sortKey, sortUp }
  return dispatch({
    type: BASIC_TABLE_SORT,
    payload,
  })
}

export const basicTableFilter = (onFilterCallback, filterKey, filterValue) => (
  dispatch
) => {
  onFilterCallback && onFilterCallback(filterKey, filterValue)
  const payload = { filterKey, filterValue }

  return dispatch({
    type: BASIC_TABLE_FILTER,
    payload,
  })
}

export const basicTableSetPage = (payload) => ({
  type: BASIC_TABLE_SET_PAGE,
  payload,
})

export const basicTableSetPageSize = (payload) => ({
  type: BASIC_TABLE_SET_PAGE_SIZE,
  payload,
})

export const basicTableSetData = (payload) => ({
  type: BASIC_TABLE_SET_DATA,
  payload,
})

export const basicTableSetSelectedData = (payload) => ({
  type: BASIC_TABLE_SET_SELECTED_DATA,
  payload,
})

export const basicTableSetPayload = (payload) => ({
  type: BASIC_TABLE_SET_COLUMNS,
  payload,
})

export const selectDataItems = (entires, selected = true) => ({
  type: BASIC_TABLE_SELECT_DATA_ITEMS,
  payload: entires.reduce((acc, e) => {
    acc[e.id] = selected
    return acc
  }, {}),
})
