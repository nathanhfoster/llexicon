import React, { Component } from "react"
import PropTypes from "prop-types"
import { Table } from "reactstrap"
import TableHeader from "./TableHeader"
import TableBody from "./TableBody"
import deepEquals from "../../helpers/deepEquals"
import { tableSort, tableFilter } from "./functions"
import { ColumnsPropType, DataPropType } from "./props"
import "./styles.css"

class BasicTable extends Component {
  constructor(props) {
    super(props)

    this.state = { sortKey: null, sortUp: false, filterMap: {} }
  }

  static propTypes = {
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
    // Custom ref handler that will be assigned to the "ref" of the inner <table> element
    innerRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.string,
      PropTypes.object
    ])
  }

  static defaultProps = {
    sortable: false,
    bordered: false,
    borderless: true,
    striped: false,
    dark: true,
    hover: false,
    responsive: true,
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

  static getDerivedStateFromProps(nextProps, prevState) {
    const { data, columns } = nextProps

    let { sort, sortKey, sortUp, filterMap } = prevState

    let sortedData = null

    if (sortKey) {
      sortedData = tableSort(data, sort, sortKey, sortUp)
    }

    if (Object.keys(filterMap).length > 0) {
      if (sortedData) {
        sortedData = tableFilter(sortedData, filterMap)
      } else {
        sortedData = tableFilter(data, filterMap)
      }
    }

    let onRowClick = null

    const firstRowClickFound = columns.find(column => column.onRowClick)

    if (firstRowClickFound) {
      onRowClick = firstRowClickFound.onRowClick
    }

    const hover = onRowClick ? true : false

    return {
      columns,
      data: sortedData || data,
      sortKey,
      sortUp,
      hover,
      onRowClick
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const dataPropsChanged = !deepEquals(this.props.data, nextProps.data)
    const dataStateChanged = !deepEquals(this.state.data, nextState.data)

    return dataPropsChanged || dataStateChanged
  }

  handleSort = (sortKey, sort, sortUp) => {
    this.setState({ sortKey, sort, sortUp })
  }

  handleFilter = (filterKey, searchValue, filter) => {
    this.setState(currentState => {
      let newFilterMap = { ...currentState.filterMap }
      newFilterMap[filterKey] = { searchValue, filter }
      return { filterMap: newFilterMap }
    })
  }

  render() {
    const {
      sortable,
      bordered,
      borderless,
      striped,
      dark,
      responsive
    } = this.props
    const { columns, data, hover, onRowClick } = this.state

    return (
      <Table
        bordered={bordered}
        borderless={borderless}
        striped={striped}
        dark={dark}
        hover={hover}
        responsive={responsive}
        className="BasicTable"
      >
        <TableHeader
          sortable={sortable}
          sortCallback={(sortKey, sort, sortUp) =>
            this.handleSort(sortKey, sort, sortUp)
          }
          filterCallback={(filterKey, searchValue, filter) =>
            this.handleFilter(filterKey, searchValue, filter)
          }
          columns={columns}
        />
        <TableBody
          sortable={sortable}
          onRowClick={onRowClick}
          columns={columns}
          data={data}
        />
      </Table>
    )
  }
}
export default BasicTable
