import { BasicTableActionTypes } from "./types"

const basicTableSort = (payload) => ({
  type: BasicTableActionTypes.BASIC_TABLE_SORT,
  payload,
})

const basicTableFilter = (payload) => ({
  type: BasicTableActionTypes.BASIC_TABLE_FILTER,
  payload,
})

const basicTableSetPage = (payload) => ({
  type: BasicTableActionTypes.BASIC_TABLE_SET_PAGE,
  payload,
})

const basicTableSetPageSize = (payload) => ({
  type: BasicTableActionTypes.BASIC_TABLE_SET_PAGE_SIZE,
  payload,
})

const basicTableResetState = () => ({
  type: BasicTableActionTypes.BASIC_TABLE_RESET,
})

export {
  basicTableSort,
  basicTableFilter,
  basicTableSetPage,
  basicTableSetPageSize,
  basicTableResetState,
}
