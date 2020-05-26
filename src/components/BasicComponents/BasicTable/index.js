import React, { createContext, useReducer, useMemo, memo } from "react"
import PropTypes from "prop-types"
import { Table } from "reactstrap"
import TableHeaders from "./TableHeaders"
import TableBody from "./TableBody"
import TableFooters from "./TableFooters"
import TablePaginator from "./TablePaginator"
import { getInitialState, BasicTableReducer } from "./state/reducer"
import { tableSort, tableFilter } from "./utils"
import { ColumnsPropType, DataPropType } from "./state/types"
import { stringMatch } from "../../../utils"
import "./styles.css"

export const BasicTableContext = createContext()

const BasicTable = ({
  data,
  bordered,
  borderless,
  striped,
  dark,
  responsive,
  hover,
  columns,
  ...propsUsedToDeriveState
}) => {
  const initialState = { columns, ...propsUsedToDeriveState }

  const [state, dispatch] = useReducer(
    BasicTableReducer,
    initialState,
    getInitialState
  )

  const { onRowClick, sortList, filterList } = state

  const sortedData = useMemo(() => tableSort(data, sortList), [data, sortList])

  const sortedAndFilteredData = useMemo(
    () => tableFilter(sortedData, filterList),
    [sortedData, filterList]
  )

  const dataLength = useMemo(() => (sortedAndFilteredData || data).length, [
    sortedAndFilteredData,
    data,
  ])

  const isHoverable = hover || onRowClick ? true : false

  const providerValue = useMemo(() => ({ state, dispatch }), [state])

  return (
    <BasicTableContext.Provider value={providerValue}>
      <Table
        className="BasicTable m-0"
        bordered={bordered}
        borderless={borderless}
        striped={striped}
        dark={dark}
        hover={isHoverable}
        responsive={responsive}
      >
        <TableHeaders />
        <TableBody data={sortedAndFilteredData} />
        <TableFooters columns={columns} data={sortedAndFilteredData} />
      </Table>
      <TablePaginator dataLength={dataLength} />
    </BasicTableContext.Provider>
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
  hover: false,
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
