import React, { useMemo, memo } from "react"
import { DataPropType, ColumnsPropType } from "../state/types"

const TableFooters = ({ data, columns }) => {
  const shouldRender = useMemo(() => columns.some((column) => column.footer))

  const renderTableRows = useMemo(
    () =>
      columns.map((column, i) => {
        const { footer } = column

        return footer ? <td key={i}>{footer(data)}</td> : <td key={i}></td>
      }),
    [columns, data]
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
  data: DataPropType,
  columns: ColumnsPropType,
}

export default memo(TableFooters)
