import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { Table } from "reactstrap"
import Header from "./Header"
import Body from "./Body"
import "./styles.css"

class BasicTable extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {
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
        render: key => <a href="#">Delete</a>
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
    const { columns, data } = nextProps

    let onRowClick = null

    const firstRowClickFound = columns.find(column => column.onRowClick)

    if (firstRowClickFound) {
      onRowClick = firstRowClickFound.onRowClick
    }

    const hover = onRowClick ? true : false

    return { columns, data, hover, onRowClick }
  }

  componentDidMount() {}

  getSnapshotBeforeUpdate(prevProps, prevState) {
    return null
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  componentWillUnmount() {}

  render() {
    const { bordered, borderless, striped, dark, responsive } = this.props
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
        <Header columns={columns} />
        <Body onRowClick={onRowClick} columns={columns} data={data} />
      </Table>
    )
  }
}
export default BasicTable
