import React, { memo } from "react"
import PropTypes from "prop-types"
import { ColumnsPropType } from "../../../state/types"

const TableDataCell = ({ className, scope, title, colSpan, children }) =>
  scope === "row" ? (
    <th className={className} scope="row" title={title} colSpan={colSpan}>
      {children}
    </th>
  ) : (
    <td className={className} title={title} colSpan={colSpan}>
      {children}
    </td>
  )

TableDataCell.propTypes = {
  className: PropTypes.string,
  scope: PropTypes.string,
  colSpan: PropTypes.number,
  columns: ColumnsPropType,
  colSpan: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
}

export default memo(TableDataCell)
