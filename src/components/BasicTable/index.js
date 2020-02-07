import React, { Fragment, useState, memo } from "react"
import PropTypes from "prop-types"
import { Table } from "reactstrap"
import TableHeader from "./TableHeader"
import TableBody from "./TableBody"
import TableFooter from "./TableFooter"
import TablePaginator from "./TablePaginator"
import { tableSort, tableFilter } from "./functions"
import { ColumnsPropType, DataPropType } from "./props"
import "./styles.css"

const getInitialState = (columns, { defaultSortKey, pageSize, pageSizes }) => {
  const { sort } = columns.find(c => (c.dataIndex || c.key) == defaultSortKey)

  const firstRowClickFound = columns.find(column => column.onRowClick)

  return {
    sortKey: defaultSortKey,
    sortUp: defaultSortKey ? true : false,
    sort,
    filterMap: {},
    onRowClick: firstRowClickFound && firstRowClickFound.onRowClick,
    currentPage: 0,
    pageSize,
    pageSizes: [{ id: 0, header: true, value: "Page Sizes" }].concat(
      pageSizes.map((value, i) => ({ id: i + 1, value }))
    )
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
  ...restOfProps
}) => {
  const [state, setState] = useState(getInitialState(columns, restOfProps))

  const {
    sortKey,
    sortUp,
    sort,
    onRowClick,
    currentPage,
    pageSize,
    pageSizes,
    filterMap
  } = state

  const handleSort = (sortKey, sort, sortUp) => {
    setState({ ...state, sortKey, sort, sortUp })
  }

  const handleFilter = (filterKey, searchValue, filter) => {
    let newFilterMap = { ...state.filterMap }
    newFilterMap[filterKey] = { searchValue, filter }
    setState({ ...state, filterMap: newFilterMap })
  }

  const handlePageChange = currentPage => {
    setState({ ...state, currentPage })
  }

  const handlePageSizeChange = (id, pageSize) => {
    setState({ ...state, pageSize, currentPage: 0 })
  }

  let sortedAndFilteredData = null

  if (sortKey) {
    sortedAndFilteredData = tableSort(data, sort, sortKey, sortUp)
  }

  const hasFilters = Object.keys(filterMap).find(
    key => filterMap[key].searchValue
  )

  if (hasFilters) {
    if (sortedAndFilteredData) {
      sortedAndFilteredData = tableFilter(sortedAndFilteredData, filterMap)
    } else {
      sortedAndFilteredData = tableFilter(data, filterMap)
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
        className="BasicTable"
      >
        <TableHeader
          sortable={sortable}
          sortCallback={handleSort}
          filterCallback={handleFilter}
          columns={columns}
          sortKey={sortKey}
          sortUp={sortUp}
        />
        <TableBody
          onRowClick={onRowClick}
          columns={columns}
          data={slicedData}
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
  defaultSortKey: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  // Custom ref handler that will be assigned to the "ref" of the inner <table> element
  innerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
    PropTypes.object
  ])
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
  columns: [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: 25
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
      width: 100,
      filter: "string"
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
      width: 200,
      filter: "string"
    },
    {
      title: "Username",
      dataIndex: "user_name",
      key: "user_name",
      render: item => <a href="#">{`Delete ${item.user_name}`}</a>,
      sort: (a, b, sortUp) =>
        sortUp
          ? b.user_name.localeCompare(a.user_name)
          : a.user_name.localeCompare(b.user_name),
      filter: searchValue => item =>
        item.user_name.toUpperCase().includes(searchValue.toUpperCase())
    }
  ],
  data: new Array(25).fill().map(
    (e, i) =>
      (e = {
        id: i,
        first_name: `first_name${i}`,
        last_name: `last_name${i}`,
        user_name: `user_name${i}`
      })
  )
}
export default memo(BasicTable)
