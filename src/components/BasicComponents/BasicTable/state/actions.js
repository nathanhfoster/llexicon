import { BasicTableActionTypes } from "./types"

const basicTableSort = (onSortCallback, sortKey, sortUp) => (
  dispatch,
  state
) => {
  onSortCallback && onSortCallback(sortKey, sortUp)
  const payload = { sortKey, sortUp }
  return dispatch({
    type: BasicTableActionTypes.BASIC_TABLE_SORT,
    payload,
  })
}

const basicTableFilter = (onFilterCallback, filterKey, filterValue) => (
  dispatch,
  state
) => {
  onFilterCallback && onFilterCallback(filterKey, filterValue)
  const payload = { filterKey, filterValue }

  return dispatch({
    type: BasicTableActionTypes.BASIC_TABLE_FILTER,
    payload,
  })
}

const basicTableSetPage = (payload) => (dispatch, state) =>
  dispatch({
    type: BasicTableActionTypes.BASIC_TABLE_SET_PAGE,
    payload,
  })

const basicTableSetPageSize = (payload) => (dispatch, state) =>
  dispatch({
    type: BasicTableActionTypes.BASIC_TABLE_SET_PAGE_SIZE,
    payload,
  })

export {
  basicTableSort,
  basicTableFilter,
  basicTableSetPage,
  basicTableSetPageSize,
}
