import { BasicTableActionTypes } from './types'

const {
  BASIC_TABLE_SORT,
  BASIC_TABLE_FILTER,
  BASIC_TABLE_SET_PAGE,
  BASIC_TABLE_SET_PAGE_SIZE,
  BASIC_TABLE_SET_DATA,
  BASIC_TABLE_SELECT_ALL_DATA,
  BASIC_TABLE_SELECT_DATA,
} = BasicTableActionTypes

const basicTableSort = (onSortCallback, sortKey, sortUp) => dispatch => {
  onSortCallback && onSortCallback(sortKey, sortUp)
  const payload = { sortKey, sortUp }
  return dispatch({
    type: BASIC_TABLE_SORT,
    payload,
  })
}

const basicTableFilter = (onFilterCallback, filterKey, filterValue) => dispatch => {
  onFilterCallback && onFilterCallback(filterKey, filterValue)
  const payload = { filterKey, filterValue }

  return dispatch({
    type: BASIC_TABLE_FILTER,
    payload,
  })
}

const basicTableSetPage = payload => ({
  type: BASIC_TABLE_SET_PAGE,
  payload,
})

const basicTableSetPageSize = payload => ({
  type: BASIC_TABLE_SET_PAGE_SIZE,
  payload,
})

const basicTableSetData = payload => ({
  type: BASIC_TABLE_SET_DATA,
  payload,
})

const selectAllData = () => ({
  type: BASIC_TABLE_SELECT_ALL_DATA,
})

const selectData = id => ({
  type: BASIC_TABLE_SELECT_DATA,
  id,
})

export {
  basicTableSort,
  basicTableFilter,
  basicTableSetPage,
  basicTableSetPageSize,
  basicTableSetData,
  selectAllData,
  selectData,
}
