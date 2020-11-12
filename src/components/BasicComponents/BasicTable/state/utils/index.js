import filterSort from './filterSort'
import tableSort from './tableSort'
import tableFilter from './tableFilter'

const getSortedAndFilteredData = (
  data,
  sortList,
  filterList,
  prevSelectedData,
  actionMenuCallback,
) => {
  const selectedDataMap = prevSelectedData.reduce((acc, d) => {
    acc[d.id] = true
    return acc
  }, {})

  let selectedData = []

  const sortedData = tableSort(data, sortList)

  const sortedAndFilteredData = tableFilter(sortedData, filterList).map(d => {
    if (selectedDataMap[d.id]) {
      const newItem = { ...d, _isSelected: true }
      selectedData.push(newItem)
      return newItem
    }
    return d
  }, [])

  const dataLength = (sortedAndFilteredData || data).length

  if (actionMenuCallback) {
    actionMenuCallback(selectedData)
  }

  return { data, sortedAndFilteredData, dataLength, selectedData, sortList, filterList }
}

const getInitialState = ({ columns, pageSize, pageSizes, data, ...restOfProps }) => {
  let sortList = []
  let filterList = []
  let firstRowClickFound = null

  for (let i = 0, { length } = columns; i < length; i++) {
    const { key, sort, filter, defaultSortValue, defaultFilterValue } = columns[i]

    const sortItem = { key, sortUp: defaultSortValue, sort }
    sortList.push(sortItem)

    const filterItem = { key, filterValue: defaultFilterValue || '', filter }
    filterList.push(filterItem)
  }

  const selectedData = data.filter(({ _isSelected }) => _isSelected)

  return {
    ...restOfProps,
    ...getSortedAndFilteredData(
      data,
      sortList,
      filterList,
      selectedData,
      // restOfProps.actionMenuCallback,
    ),
    columns,
    currentPage: 0,
    pageSize,
    pageSizes: [{ id: 0, header: true, value: 'Page Sizes' }].concat(
      pageSizes.map((value, i) => ({ id: i + 1, value })),
    ),
  }
}

export { getSortedAndFilteredData, filterSort, tableSort, tableFilter, getInitialState }
