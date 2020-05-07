import React, { Fragment, useReducer, useCallback, useMemo, memo } from "react"
import PropTypes from "prop-types"
import { Table } from "reactstrap"
import TableHeaders from "./TableHeaders"
import TableBody from "./TableBody"
import TableFooters from "./TableFooters"
import TablePaginator from "./TablePaginator"
import { tableSort, tableFilter } from "./utils"
import { ColumnsPropType, DataPropType } from "./state/propTypes"
import { stringMatch } from "../../helpers"
import { getInitialState, BasicTableReducer } from "./state/reducer"
import {
  basicTableSort,
  basicTableFilter,
  basicTableSetPage,
  basicTableSetPageSize,
  basicTableResetState,
} from "./state/actions"
import "./styles.css"

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
  const [state, dispatch] = useReducer(
    BasicTableReducer,
    { columns, ...propsUsedToDeriveState },
    getInitialState
  )

  const {
    onRowClick,
    currentPage,
    pageSize,
    pageSizes,
    sortList,
    filterList,
  } = state

  // console.log("sortList: ", sortList)
  // console.log("filterList: ", filterList)

  const handleSort = useCallback((sortKey, sortUp) => {
    onSortCallback && onSortCallback(sortKey, sortUp)

    const payload = { sortKey, sortUp }

    dispatch(basicTableSort(payload))
  }, [])

  const handleFilter = useCallback((filterKey, filterValue) => {
    onFilterCallback && onFilterCallback(filterKey, filterValue)

    const payload = { filterKey, filterValue }

    dispatch(basicTableFilter(payload))
  }, [])

  const handlePageChange = (currentPage) => {
    dispatch(basicTableSetPage(currentPage))
  }

  const handlePageSizeChange = (id, pageSize) => {
    dispatch(basicTableSetPageSize(pageSize))
  }

  const sortedData = useMemo(() => tableSort(data, sortList), [data, sortList])

  const sortedAndFilteredData = useMemo(
    () => tableFilter(sortedData, filterList),
    [sortedData, filterList]
  )

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
        <TableHeaders
          sortable={sortable}
          sortCallback={handleSort}
          filterCallback={handleFilter}
          columns={columns}
          sortList={sortList}
        />
        <TableBody
          columns={columns}
          data={sortedAndFilteredData}
          currentPage={currentPage}
          pageSize={pageSize}
          onRowClick={onRowClick}
        />
        <TableFooters
          onRowClick={onRowClick}
          columns={columns}
          data={sortedAndFilteredData}
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
  sortList: [],
  sortList: [],
  columns: [
    {
      title: "#",
      key: "id",
      width: 25,
    },
    {
      title: "First Name",
      key: "first_name",
      width: 100,
      filter: "string",
    },
    {
      title: "Last Name",
      key: "last_name",
      width: 200,
      filter: "string",
    },
    {
      title: "Username",
      key: "user_name",
      render: (item) => <a href="#">{`Delete ${item.user_name}`}</a>,
      sort: (a, b, sortUp) =>
        sortUp
          ? b.user_name.localeCompare(a.user_name)
          : a.user_name.localeCompare(b.user_name),
      filter: (filterValue) => (item) =>
        stringMatch(item.user_name, filterValue),
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
