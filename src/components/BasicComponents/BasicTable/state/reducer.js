import { exportJSON } from 'utils'
import { BasicTableActionTypes } from './types'
import { filterSort, getSortedAndFilteredData } from './utils'

const {
  BASIC_TABLE_SORT,
  BASIC_TABLE_FILTER,
  BASIC_TABLE_SET_PAGE,
  BASIC_TABLE_SET_PAGE_SIZE,
  BASIC_TABLE_SET_DATA,
  BASIC_TABLE_SELECT_ALL_DATA,
  BASIC_TABLE_SELECT_DATA,
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
        ...getSortedAndFilteredData(state.data, newSortList, state.filterList),
      }

    case BASIC_TABLE_FILTER:
      const newFilterList = filterSort(state.filterList, payload.filterKey, {
        filterValue: payload.filterValue,
      })

      return {
        ...state,
        ...getSortedAndFilteredData(state.data, state.sortList, newFilterList),
        currentPage: 0,
      }

    case BASIC_TABLE_SET_PAGE:
      return { ...state, currentPage: payload }

    case BASIC_TABLE_SET_PAGE_SIZE:
      return { ...state, pageSize: payload, currentPage: 0 }

    case BASIC_TABLE_SET_DATA:
      return {
        ...state,
        ...getSortedAndFilteredData(payload, state.sortList, state.filterList),
      }

    case BASIC_TABLE_SELECT_ALL_DATA:
      return {
        ...state,
        data: state.data.map(d => ({ ...d, _dataSelected: !d._dataSelected })),
        sortedAndFilteredData: state.sortedAndFilteredData.map(d => ({
          ...d,
          _dataSelected: !d._dataSelected,
        })),
      }

    case BASIC_TABLE_SELECT_DATA:
      const mapCallback = d => ({
        ...d,
        _dataSelected: d.id === id ? !d._dataSelected : !!d._dataSelected,
      })
      return {
        ...state,
        data: state.data.map(mapCallback),
        sortedAndFilteredData: state.sortedAndFilteredData.map(mapCallback),
      }

    default:
      return state
  }
}

export { BasicTableReducer }
