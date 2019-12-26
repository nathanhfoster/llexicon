import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { ColumnsPropType, DataPropType } from "../props"
import "./styles.css"

class TableBody extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {
    sortable: PropTypes.bool.isRequired,
    columns: ColumnsPropType,
    data: DataPropType
  }

  static defaultProps = {}

  static getDerivedStateFromProps(nextProps, prevState) {
    const { columns, data, onRowClick } = nextProps

    return { columns, data, onRowClick }
  }

  renderTableRows = (columns, data, onRowClick) => {
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

    return <tbody>{this.renderTableRows(columns, data, onRowClick)}</tbody>
  }
}
export default TableBody
