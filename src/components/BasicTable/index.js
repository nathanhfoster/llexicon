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

  static propTypes = {}

  static defaultProps = {
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
        render: () => <a href="#">Delete</a>
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
    return { columns, data }
  }

  componentDidMount() {}

  getSnapshotBeforeUpdate(prevProps, prevState) {
    return null
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  componentWillUnmount() {}

  render() {
    const { columns, data } = this.state

    return (
      <Table dark responsive className="BasicTable">
        <Header columns={columns} />
        <Body columns={columns} data={data} />
      </Table>
    )
  }
}
export default BasicTable
