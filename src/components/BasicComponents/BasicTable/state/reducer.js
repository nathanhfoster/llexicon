import { BasicTableActionTypes } from "./types"
import { filterSort } from "../utils"

const getInitialState = ({ columns, pageSize, pageSizes, ...restOfProps }) => {
  let sortList = []
  let filterList = []
  let firstRowClickFound = null

  for (let i = 0, { length } = columns; i < length; i++) {
    const {
      key,
      sort,
      filter,
      defaultSortValue,
      defaultFilterValue,
      onRowClick,
    } = columns[i]

    if (!firstRowClickFound && onRowClick) firstRowClickFound = onRowClick

    const sortItem = { key, sortUp: defaultSortValue, sort }
    sortList.push(sortItem)

    const filterItem = { key, filterValue: defaultFilterValue || "", filter }
    filterList.push(filterItem)
  }

  return {
    ...restOfProps,
    columns,
    sortList,
    filterList,
    onRowClick: firstRowClickFound,
    currentPage: 0,
    pageSize,
    pageSizes: [{ id: 0, header: true, value: "Page Sizes" }].concat(
      pageSizes.map((value, i) => ({ id: i + 1, value }))
    ),
  }
}

const BasicTableReducer = (state, action) => {
  const { type, payload } = action

  switch (type) {
    case BasicTableActionTypes.BASIC_TABLE_SORT:
      const newSortList = filterSort(state.sortList, payload.sortKey, {
        sortUp: payload.sortUp,
      })

      return {
        ...state,
        sortList: newSortList,
      }

    case BasicTableActionTypes.BASIC_TABLE_FILTER:
      const newFilterList = filterSort(state.filterList, payload.filterKey, {
        filterValue: payload.filterValue,
      })

      return {
        ...state,
        filterList: newFilterList,
        currentPage: 0,
      }

    case BasicTableActionTypes.BASIC_TABLE_SET_PAGE:
      return { ...state, currentPage: payload }

    case BasicTableActionTypes.BASIC_TABLE_SET_PAGE_SIZE:
      return { ...state, pageSize: payload, currentPage: 0 }

    default:
      return state
  }
}

export { getInitialState, BasicTableReducer }
