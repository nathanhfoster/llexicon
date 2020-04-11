import React, { Fragment, useState, useCallback, memo } from "react"
import PropTypes from "prop-types"
import { Table } from "reactstrap"
import TableHeader from "./TableHeader"
import TableBody from "./TableBody"
import TableFooter from "./TableFooter"
import TablePaginator from "./TablePaginator"
import { tableSort, tableFilter } from "./utils"
import { ColumnsPropType, DataPropType } from "./propTypes"
import { stringMatch } from "../../helpers"
import "./styles.css"

const getInitialState = (
  columns,
  { pageSize, pageSizes, sortMap, filterMap }
) => {
  for (let i = 0, { length } = columns; i < length; i++) {
    const {
      dataIndex,
      key,
      sort,
      filter,
      defaultSortValue,
      defaultFilterValue,
    } = columns[i]
    const uniqueKey = dataIndex || key

    sortMap[uniqueKey] = {
      sortUp: defaultSortValue,
      sort,
    }

    filterMap[uniqueKey] = { searchValue: defaultFilterValue || "", filter }
  }

  const firstRowClickFound = columns.find((column) => column.onRowClick)

  return {
    sortMap,
    filterMap,
    onRowClick: firstRowClickFound && firstRowClickFound.onRowClick,
    currentPage: 0,
    pageSize,
    pageSizes: [{ id: 0, header: true, value: "Page Sizes" }].concat(
      pageSizes.map((value, i) => ({ id: i + 1, value }))
    ),
  }
}

const BasicTable = ({
  data,
  bordered,
  borderless,
  striped,
  dark,
  responsive,
  sortable,
  columns,
  onSortCallback,
  onFilterCallback,
  ...propsUsedToDeriveState
}) => {
  const [
    { onRowClick, currentPage, pageSize, pageSizes, sortMap, filterMap },
    setState,
  ] = useState(getInitialState(columns, propsUsedToDeriveState))

  // console.log("sortMap: ", sortMap)
  // console.log("filterMap: ", filterMap)

  const handleSort = useCallback((sortKey, sortUp) => {
    onSortCallback && onSortCallback(sortKey, sortUp)

    setState((prevState) => ({
      ...prevState,
      sortMap: {
        ...prevState.sortMap,
        [sortKey]: { ...prevState.sortMap[sortKey], sortUp },
      },
    }))
  }, [])

  const handleFilter = useCallback((filterKey, searchValue) => {
    onFilterCallback && onFilterCallback(filterKey, searchValue)

    setState((prevState) => ({
      ...prevState,
      filterMap: {
        ...prevState.filterMap,
        [filterKey]: { ...prevState.filterMap[filterKey], searchValue },
      },
    }))
  }, [])

  const handlePageChange = (currentPage) => {
    setState((prevState) => ({ ...prevState, currentPage }))
  }

  const handlePageSizeChange = (id, pageSize) => {
    setState((prevState) => ({ ...prevState, pageSize, currentPage: 0 }))
  }

  let sortedAndFilteredData = [...data]

  const hasSorting = Object.keys(sortMap).find(
    (key) => sortMap[key] && sortMap[key].sortUp !== undefined
  )

  if (hasSorting) {
    sortedAndFilteredData = tableSort(sortedAndFilteredData, sortMap)
  }

  const hasFilters = Object.keys(filterMap).find(
    (key) => filterMap[key] && filterMap[key].searchValue
  )

  if (hasFilters) {
    if (sortedAndFilteredData.length > 0) {
      sortedAndFilteredData = tableFilter(sortedAndFilteredData, filterMap)
    } else {
      sortedAndFilteredData = tableFilter(sortedAndFilteredData, filterMap)
    }
  }

  const sliceStart = currentPage * pageSize

  const sliceEnd = sliceStart + pageSize

  const slicedData = (sortedAndFilteredData || data).slice(sliceStart, sliceEnd)

  const dataLength = (sortedAndFilteredData || data).length

  const totalPages = Math.ceil(dataLength / pageSize)

  return (
    <Fragment>
      <Table
        bordered={bordered}
        borderless={borderless}
        striped={striped}
        dark={dark}
        hover={onRowClick ? true : false}
        responsive={responsive}
        className="BasicTable m-0"
      >
        <TableHeader
          sortable={sortable}
          sortCallback={handleSort}
          filterCallback={handleFilter}
          columns={columns}
          sortMap={sortMap}
        />
        <TableBody
          columns={columns}
          data={slicedData}
          onRowClick={onRowClick}
        />
        <TableFooter
          onRowClick={onRowClick}
          columns={columns}
          sortedAndFilteredData={sortedAndFilteredData}
        />
      </Table>
      <TablePaginator
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        pageSizes={pageSizes}
        dataLength={dataLength}
        handlePageChange={handlePageChange}
        handlePageSizeChange={handlePageSizeChange}
      />
    </Fragment>
  )
}

BasicTable.propTypes = {
  sortable: PropTypes.bool.isRequired,
  columns: ColumnsPropType,
  data: DataPropType,
  onSortCallback: PropTypes.func,
  onFilterCallback: PropTypes.func,
  sortMap: PropTypes.shape({ sortUp: PropTypes.oneOf([false, true, null]) })
    .isRequired,
  filterMap: PropTypes.shape({ searchValue: PropTypes.string }).isRequired,
  // reactstrap Table
  tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  size: PropTypes.string,
  bordered: PropTypes.bool,
  borderless: PropTypes.bool,
  striped: PropTypes.bool,
  dark: PropTypes.bool,
  hover: PropTypes.bool,
  responsive: PropTypes.bool,
  pageSize: PropTypes.number.isRequired,
  pageSizes: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  // Custom ref handler that will be assigned to the "ref" of the inner <table> element
  innerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
    PropTypes.object,
  ]),
}

BasicTable.defaultProps = {
  sortable: false,
  bordered: false,
  borderless: true,
  striped: false,
  dark: true,
  responsive: true,
  pageSize: 10,
  pageSizes: [5, 10, 15, 20, 25, 50, 100],
  sortMap: {},
  filterMap: {},
  columns: [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: 25,
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
      width: 100,
      filter: "string",
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
      width: 200,
      filter: "string",
    },
    {
      title: "Username",
      dataIndex: "user_name",
      key: "user_name",
      render: (item) => <a href="#">{`Delete ${item.user_name}`}</a>,
      sort: (a, b, sortUp) =>
        sortUp
          ? b.user_name.localeCompare(a.user_name)
          : a.user_name.localeCompare(b.user_name),
      filter: (searchValue) => (item) =>
        stringMatch(item.user_name, searchValue),
    },
  ],
  data: new Array(25).fill().map(
    (e, i) =>
      (e = {
        id: i,
        first_name: `first_name${i}`,
        last_name: `last_name${i}`,
        user_name: `user_name${i}`,
      })
  ),
}
export default memo(BasicTable)
