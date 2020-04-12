import React, { useMemo, memo } from "react"
import { ColumnsPropType, DataPropType } from "../propTypes"

const TableFooters = ({ columns, sortedAndFilteredData }) => {
  const shouldRender = useMemo(() => columns.some((column) => column.footer))

  const renderTableRows = useMemo(
    () =>
      columns.map((column, i) => {
        const { footer } = column

        return footer ? (
          <td key={i}>{footer(sortedAndFilteredData)}</td>
        ) : (
          <td key={i}></td>
        )
      }),
    [columns, sortedAndFilteredData]
  )

  return (
    shouldRender && (
      <tfoot>
        <tr>{renderTableRows}</tr>
      </tfoot>
    )
  )
}

TableFooters.propTypes = {
  columns: ColumnsPropType,
  sortedAndFilteredData: DataPropType,
}

export default memo(TableFooters)
