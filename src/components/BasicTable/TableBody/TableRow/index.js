import React, { memo } from "react"
import PropTypes from "prop-types"
import { ColumnsPropType, DataPropType } from "../../propTypes"

const TableRow = ({
  onRowClick,
  item,
  render,
  firstItemIndexOrKeyValue,
  restOfColumns,
}) => (
  <tr onClick={onRowClick ? () => onRowClick(item) : null}>
    <th scope="row" style={{ fontWeight: "normal" }}>
      {render ? render(item) : firstItemIndexOrKeyValue}
    </th>
    {restOfColumns.map((c, j) => {
      const { title, key, width = "auto", render } = c
      const itemValue = item[key]
      return <td key={j}>{render ? render(item) : itemValue}</td>
    })}
  </tr>
)

TableRow.propTypes = {
  onRowClick: PropTypes.func,
  item: PropTypes.object,
  render: PropTypes.object,
  firstItemIndexOrKeyValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  restOfColumns: ColumnsPropType,
}

export default memo(TableRow)
