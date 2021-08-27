import filterSort from "./filterSort"
import tableSort from "./tableSort"
import tableFilter from "./tableFilter"
import { copyStringToClipboard } from "utils"

const getSortedAndFilteredData = (
  data,
  sortList,
  filterList,
  actionMenuCallback
) => {
  let selectedData = []

  const sortedData = tableSort(data, sortList)

  const sortedAndFilteredData = tableFilter(sortedData, filterList)

  const dataLength = (sortedAndFilteredData || data).length

  if (actionMenuCallback) {
    actionMenuCallback(selectedData)
  }

  return {
    data,
    sortedAndFilteredData,
    dataLength,
    sortList,
    filterList,
  }
}

const getSortAndFilterList = (columns) => {
  let sortList = []
  let filterList = []
  for (let i = 0, { length } = columns; i < length; i++) {
    const { key, sort, filter, defaultSortValue, defaultFilterValue } = columns[
      i
    ]

    const sortItem = { key, sortUp: defaultSortValue, sort }
    sortList.push(sortItem)

    const filterItem = { key, filterValue: defaultFilterValue || "", filter }
    filterList.push(filterItem)
  }

  return {
    sortList,
    filterList,
  }
}

const getInitialState = ({
  columns,
  pageSize,
  pageSizes,
  data,
  ...restOfProps
}) => {
  let firstRowClickFound = null

  const { sortList, filterList } = getSortAndFilterList(columns)

  return {
    ...restOfProps,
    ...getSortedAndFilteredData(
      data,
      sortList,
      filterList
      // restOfProps.actionMenuCallback,
    ),
    columns,
    currentPage: 0,
    pageSize,
    pageSizes: [{ id: 0, header: true, value: "Page Sizes" }].concat(
      pageSizes.map((value, i) => ({ id: i + 1, value }))
    ),
  }
}

export {
  getSortedAndFilteredData,
  filterSort,
  tableSort,
  tableFilter,
  getInitialState,
  getSortAndFilterList,
}
