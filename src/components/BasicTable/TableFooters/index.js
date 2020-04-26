import React, { useMemo, memo } from "react"
import { ColumnsPropType, DataPropType } from "../propTypes"

const TableFooters = ({ columns, data }) => {
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
  columns: ColumnsPropType,
  data: DataPropType,
}

export default memo(TableFooters)
