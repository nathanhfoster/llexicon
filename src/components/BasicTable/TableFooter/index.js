import React, { useMemo, memo } from "react"
import PropTypes from "prop-types"
import { ColumnsPropType, DataPropType } from "../props"
import "./styles.css"

const renderTableRows = (columns, sortedAndFilteredData, onRowClick) =>
  columns.map((column, i) => {
    const { footer } = column

    return footer ? (
      <td key={i}>{footer(sortedAndFilteredData)}</td>
    ) : (
      <td key={i}></td>
    )
  })

const TableFooter = ({ columns, sortedAndFilteredData, onRowClick }) => {
  const shouldRender = useMemo(() => columns.some(column => column.footer))

  return (
    shouldRender && (
      <tfoot>
        <tr>{renderTableRows(columns, sortedAndFilteredData, onRowClick)}</tr>
      </tfoot>
    )
  )
}

TableFooter.propTypes = {
  onRowClick: PropTypes.func,
  columns: ColumnsPropType,
  sortedAndFilteredData: DataPropType
}

export default memo(TableFooter)
