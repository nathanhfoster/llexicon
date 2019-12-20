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
        title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        dataIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        render: PropTypes.func
      })
    ),
    data: PropTypes.arrayOf(PropTypes.object.isRequired)
  }

  static defaultProps = {}

  static getDerivedStateFromProps(nextProps, prevState) {
    const { columns, data } = nextProps

    let onRowClick = null

    const firstRowClickFound = columns.find(column => column.onRowClick)

    if (firstRowClickFound) {
      onRowClick = firstRowClickFound.onRowClick
    }

    const TableBodyClassName = onRowClick ? "BasicTableWithRowHover" : ""

    return { columns, data, onRowClick, TableBodyClassName }
  }

  renderColumnData = (columns, data, onRowClick) => {
    if (columns.length === 0 || data.length === 0) return null

    return data.map((item, i) => {
      const [firstColumn, ...restOfColumns] = columns
      const { title, dataIndex, key, width = "auto", render } = firstColumn
      const firstItemValue = item[key]
      const firstItemRender = render
      const firstItemWidth = width

      return (
        <tr
          key={i}
          onClick={onRowClick ? () => onRowClick(firstItemValue) : null}
        >
          <th scope="row" style={{ width: firstItemWidth }}>
            {firstItemRender ? firstItemRender(firstItemValue) : firstItemValue}
          </th>
          {restOfColumns.map((c, j) => {
            const { title, dataIndex, key, width = "auto", render } = c
            const itemValue = item[key]
            const itemRender = render
            return (
              <td key={j} style={{ width }}>
                {itemRender ? itemRender(itemValue) : itemValue}
              </td>
            )
          })}
        </tr>
      )
    })
  }

  render() {
    const { columns, data, onRowClick, TableBodyClassName } = this.state

    return (
      <tbody className={TableBodyClassName}>
        {this.renderColumnData(columns, data, onRowClick)}
      </tbody>
    )
  }
}
export default Body
