import React, { useContext, useMemo, memo } from "react"
import { DataPropType } from "../state/types"
import { BasicTableContext } from "../"

const TableFooters = ({ data }) => {
  const [{ columns }, dispatch] = useContext(BasicTableContext)
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
}

export default memo(TableFooters)
