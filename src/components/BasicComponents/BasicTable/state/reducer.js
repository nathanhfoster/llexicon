import { BasicTableActionTypes } from './types'
import { filterSort, getSortedAndFilteredData } from './utils'

const {
  BASIC_TABLE_SORT,
  BASIC_TABLE_FILTER,
  BASIC_TABLE_SET_PAGE,
  BASIC_TABLE_SET_PAGE_SIZE,
  BASIC_TABLE_SET_DATA,
  BASIC_TABLE_SELECT_DATA_ITEMS,
  BASIC_TABLE_SELECT_DATA_ITEM,
} = BasicTableActionTypes

const BasicTableReducer = (state, action) => {
  const { type, id, payload } = action

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
          state.selectedData,
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
          state.selectedData,
          state.actionMenuCallback,
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
          state.selectedData,
          state.actionMenuCallback,
        ),
      }

    case BASIC_TABLE_SELECT_DATA_ITEMS:
      let selectedData = []
      const newSortedAndFilteredData = state.sortedAndFilteredData.map(d => {
        const _isSelected = payload[d.id]
        if (_isSelected) selectedData.push(d)
        return {
          ...d,
          _isSelected,
        }
      })

      state.actionMenuCallback(selectedData)

      return {
        ...state,
        sortedAndFilteredData: newSortedAndFilteredData,
        selectedData,
      }

    case BASIC_TABLE_SELECT_DATA_ITEM:
      let newSelectedData = []
      const newSortedAndFilteredDataWithItem = state.sortedAndFilteredData.map(d => {
        const _isSelected = d.id === id ? payload : d._isSelected
        if (_isSelected) newSelectedData.push(d)
        return {
          ...d,
          _isSelected,
        }
      })

      state.actionMenuCallback(newSelectedData)

      return {
        ...state,
        sortedAndFilteredData: newSortedAndFilteredDataWithItem,
        selectedData: newSelectedData,
      }

    default:
      return state
  }
}

export { BasicTableReducer }
