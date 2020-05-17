import React, { useMemo, memo } from "react"
import PropTypes from "prop-types"
import TableDataCell from "./TableDataCell"
import { ColumnsPropType } from "../../state/types"

const TableRow = ({ onRowClick, item, columns }) => {
  const handleRowClick = onRowClick ? () => onRowClick(item) : null
  const [firstColumn, ...restOfColumns] = columns
  const { key, render } = firstColumn
  const renderRestOfColumns = useMemo(
    () =>
      restOfColumns.map((c, j) => {
        const { key, render } = c
        return (
          <TableDataCell key={j} render={render} item={item} itemKey={key} />
        )
      }),
    [restOfColumns]
  )
  return (
    <tr onClick={handleRowClick}>
      <TableDataCell scope="row" render={render} item={item} itemKey={key} />
      {renderRestOfColumns}
    </tr>
  )
}

TableRow.propTypes = {
  onRowClick: PropTypes.func,
  item: PropTypes.object,
  columns: ColumnsPropType,
}

export default memo(TableRow)
