import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import "./styles.css"

class Body extends PureComponent {
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
    data: PropTypes.arrayOf(PropTypes.object.isRequired)
  }

  static defaultProps = {}

  static getDerivedStateFromProps(nextProps, prevState) {
    const { columns, data, onRowClick } = nextProps

    return { columns, data, onRowClick }
  }

  renderColumnData = (columns, data, onRowClick) => {
    if (columns.length === 0 || data.length === 0) return null

    return data.map((item, i) => {
      const [firstColumn, ...restOfColumns] = columns
      const { title, dataIndex, key, width = "auto", render } = firstColumn
      const firstItemIndexOrKeyValue = item[dataIndex || key]

      return (
        <tr key={i} onClick={onRowClick ? () => onRowClick(item) : null}>
          <th scope="row" style={{ fontWeight: "normal" }}>
            {render ? render(item) : firstItemIndexOrKeyValue}
          </th>
          {restOfColumns.map((c, j) => {
            const { title, dataIndex, key, width = "auto", render } = c
            const itemValue = item[dataIndex || key]
            return <td key={j}>{render ? render(item) : itemValue}</td>
          })}
        </tr>
      )
    })
  }

  render() {
    const { columns, data, onRowClick } = this.state

    return <tbody>{this.renderColumnData(columns, data, onRowClick)}</tbody>
  }
}
export default Body
