import React, { Component } from "react"
import PropTypes from "prop-types"
import { Table } from "reactstrap"
import Header from "./Header"
import Body from "./Body"
import deepEquals from "../../helpers/deepEquals"
import "./styles.css"

class BasicTable extends Component {
  constructor(props) {
    super(props)

    this.state = { sortKey: null, sortUp: false }
  }

  static propTypes = {
    sortable: PropTypes.bool.isRequired,
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
          PropTypes.func
        ]),
        dataIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        render: PropTypes.func,
        onRowClick: PropTypes.func
      })
    ),
    data: PropTypes.arrayOf(PropTypes.object.isRequired),
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
        width: 100
      },
      {
        title: "Last Name",
        dataIndex: "last_name",
        key: "last_name",
        width: 200
      },
      {
        title: "Username",
        dataIndex: "user_name",
        key: "user_name",
        render: item => <a href="#">{`Delete ${item.user_name}`}</a>,
        sort: (a, b, sortUp) =>
          sortUp
            ? b.user_name.localeCompare(a.user_name)
            : a.user_name.localeCompare(b.user_name)
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

    let { sortKey, sortUp } = prevState

    let sortedData = null

    if (sortKey) {
      const sortColumn = columns.find(
        c => c.dataIndex === sortKey || c.key === sortKey
      )

      //JSON.parse(JSON.stringify(data))
      sortedData = [...data].sort((a, b) => {
        if (sortColumn.sort) {
          return sortColumn.sort(a, b, sortUp)
        } else {
          const aValue = a[sortKey]
          const bValue = b[sortKey]
          let valueType = null

          if (typeof aValue === typeof bValue) {
            valueType = typeof aValue
          }

          // console.log("valueType: ", valueType)

          if (valueType === "string") {
            return sortUp
              ? bValue.localeCompare(aValue)
              : aValue.localeCompare(bValue)
          } else if (valueType === "number") {
            return sortUp ? bValue - aValue : aValue - bValue
          } else if (Array.isArray(aValue)) {
            return sortUp
              ? bValue.join().localeCompare(aValue.join())
              : aValue.join().localeCompare(bValue.join())
          } else if (valueType === "object") {
            // console.log(aValue)
            // console.log("OBJECT")
          }
        }
      })
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
    const dataChanged = !deepEquals(this.props.data, nextProps.data)
    const dataSorted = !deepEquals(this.state.data, nextState.data)

    return true
  }

  // getSnapshotBeforeUpdate(prevProps, prevState) {
  //   const dataChanged = !deepEquals(prevProps.data, this.props.data)
  //   if (dataChanged) {
  //     return true
  //   }
  //   return null
  // }

  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   if (snapshot) {
  //     const { data } = this.props
  //     this.setState({ data })
  //   }
  // }

  handleSort = (sortKey, sortUp) => {
    this.setState({ sortKey, sortUp })
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

    // console.log(data)

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
        <Header
          sortable={sortable}
          sortCallback={(sortKey, sortUp) => this.handleSort(sortKey, sortUp)}
          columns={columns}
        />
        <Body
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
