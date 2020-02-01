import React, { memo } from "react"
import PropTypes from "prop-types"
import { ColumnsPropType, DataPropType } from "../props"
import "./styles.css"

const renderTableRows = (columns, data, onRowClick) =>
  columns.map((column, i) => {
    const { footer } = column

    return footer ? <td key={i}>{footer(data)}</td> : <td key={i}></td>
  })

const TableFooter = ({ columns, data, onRowClick }) => (
  <tfoot>
    <tr>{renderTableRows(columns, data, onRowClick)}</tr>
  </tfoot>
)

TableFooter.propTypes = {
  onRowClick: PropTypes.func,
  columns: ColumnsPropType,
  data: DataPropType
}

export default memo(TableFooter)
