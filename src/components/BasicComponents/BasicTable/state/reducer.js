import { BasicTableActionTypes } from './types';
import { filterSort, getSortedAndFilteredData } from './utils';

const BasicTableReducer = (state, action) => {
  const { type, payload } = action;
 

  switch (type) {
    case BasicTableActionTypes.BASIC_TABLE_SORT:
      const newSortList = filterSort(state.sortList, payload.sortKey, {
        sortUp: payload.sortUp,
      });

      return {
        ...state,
        ...getSortedAndFilteredData(state.data, newSortList, state.filterList),
      };

    case BasicTableActionTypes.BASIC_TABLE_FILTER:
      const newFilterList = filterSort(state.filterList, payload.filterKey, {
        filterValue: payload.filterValue,
      });

      return {
        ...state,
        ...getSortedAndFilteredData(state.data, state.sortList, newFilterList),
        currentPage: 0,
      };

    case BasicTableActionTypes.BASIC_TABLE_SET_PAGE:
      return { ...state, currentPage: payload };

    case BasicTableActionTypes.BASIC_TABLE_SET_PAGE_SIZE:
      return { ...state, pageSize: payload, currentPage: 0 };

    case BasicTableActionTypes.BASIC_TABLE_SET_DATA:
      return {
        ...state,
        ...getSortedAndFilteredData(payload, state.sortList, state.filterList),
      };

    default:
      return state;
  }
};

export { BasicTableReducer };
