import React, { useMemo, memo } from "react"
import PropTypes from "prop-types"
import { ColumnsPropType, DataPropType } from "../propTypes"
import "./styles.css"

const TableFooter = ({ columns, sortedAndFilteredData, onRowClick }) => {
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

TableFooter.propTypes = {
  onRowClick: PropTypes.func,
  columns: ColumnsPropType,
  sortedAndFilteredData: DataPropType,
}

export default memo(TableFooter)
