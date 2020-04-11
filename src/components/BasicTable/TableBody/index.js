import React, { useMemo, memo } from "react"
import PropTypes from "prop-types"
import { ColumnsPropType, DataPropType } from "../propTypes"
import "./styles.css"

const TableBody = ({ columns, data, onRowClick }) => {
  const renderTableRows = useMemo(
    () =>
      data.map((item, i) => {
        const [firstColumn, ...restOfColumns] = columns
        const { title,  key, width = "auto", render } = firstColumn
        const firstItemIndexOrKeyValue = item[key]

        return (
          <tr key={i} onClick={onRowClick ? () => onRowClick(item) : null}>
            <th scope="row" style={{ fontWeight: "normal" }}>
              {render ? render(item) : firstItemIndexOrKeyValue}
            </th>
            {restOfColumns.map((c, j) => {
              const { title,  key, width = "auto", render } = c
              const itemValue = item[ key]
              return <td key={j}>{render ? render(item) : itemValue}</td>
            })}
          </tr>
        )
      }),
    [columns, data]
  )
  return <tbody>{renderTableRows}</tbody>
}

TableBody.propTypes = {
  onRowClick: PropTypes.func,
  columns: ColumnsPropType,
  data: DataPropType,
}

export default memo(TableBody)
