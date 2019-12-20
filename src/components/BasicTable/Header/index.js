import React, { PureComponent } from "react"
import PropTypes from "prop-types"

class Header extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        dataIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        render: PropTypes.func,
        onRowClick: PropTypes.func
      })
    )
  }

  static defaultProps = {}

  static getDerivedStateFromProps(nextProps, prevState) {
    const { columns } = nextProps
    return { columns }
  }

  renderColumnHeaders = columns =>
    columns.map((c, i) => {
      const { title, dataIndex, key, width } = c
      return (
        <th key={i} style={{ width }}>
          {title}
        </th>
      )
    })

  render() {
    const { columns } = this.state
    return (
      <thead>
        <tr>{this.renderColumnHeaders(columns)}</tr>
      </thead>
    )
  }
}
export default Header
