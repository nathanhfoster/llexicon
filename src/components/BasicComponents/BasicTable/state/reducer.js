import { BasicTableActionTypes } from './types'
import { filterSort, getSortedAndFilteredData } from './utils'

const {
  BASIC_TABLE_SORT,
  BASIC_TABLE_FILTER,
  BASIC_TABLE_SET_PAGE,
  BASIC_TABLE_SET_PAGE_SIZE,
  BASIC_TABLE_SET_DATA,
  BASIC_TABLE_SET_SELECTED_DATA,
  BASIC_TABLE_SELECT_DATA_ITEMS,
} = BasicTableActionTypes

const BasicTableReducer = (state, action) => {
  const { type, id, payload } = action
  let newItem

  switch (type) {
    case BASIC_TABLE_SORT:
      const newSortList = filterSort(state.sortList, payload.sortKey, {
        sortUp: payload.sortUp,
      })
      return {
        ...state,
        ...getSortedAndFilteredData(
          state.data,
          newSortList,
          state.filterList,
          state.actionMenuCallback,
        ),
      }

    case BASIC_TABLE_FILTER:
      const newFilterList = filterSort(state.filterList, payload.filterKey, {
        filterValue: payload.filterValue,
      })

      return {
        ...state,
        ...getSortedAndFilteredData(
          state.data,
          state.sortList,
          newFilterList,
          // state.actionMenuCallback,
        ),
        currentPage: 0,
      }

    case BASIC_TABLE_SET_PAGE:
      return { ...state, currentPage: payload }

    case BASIC_TABLE_SET_PAGE_SIZE:
      return { ...state, pageSize: payload, currentPage: 0 }

    case BASIC_TABLE_SET_DATA:
      return {
        ...state,
        ...getSortedAndFilteredData(
          payload,
          state.sortList,
          state.filterList,
          // state.actionMenuCallback,
        ),
      }

    case BASIC_TABLE_SET_SELECTED_DATA:
      return { ...state, selectedDataMap: payload }

    case BASIC_TABLE_SELECT_DATA_ITEMS:
      newItem = Object.entries({ ...state.selectedDataMap, ...payload }).reduce(
        (acc, [key, value]) => {
          if (value) {
            acc[key] = value
          }
          return acc
        },
        {},
      )
      state.actionMenuCallback(newItem)
      return {
        ...state,
        selectedDataMap: newItem,
      }

    default:
      return state
  }
}

export { BasicTableReducer }
