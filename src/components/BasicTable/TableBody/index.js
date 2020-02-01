import React, { memo } from "react"
import PropTypes from "prop-types"
import { ColumnsPropType, DataPropType } from "../props"
import "./styles.css"

const renderTableRows = (columns, data, onRowClick) =>
  data.map((item, i) => {
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

const TableBody = ({ columns, data, onRowClick }) => (
  <tbody>{renderTableRows(columns, data, onRowClick)}</tbody>
)

TableBody.propTypes = {
  onRowClick: PropTypes.func,
  columns: ColumnsPropType,
  data: DataPropType
}

export default memo(TableBody)
