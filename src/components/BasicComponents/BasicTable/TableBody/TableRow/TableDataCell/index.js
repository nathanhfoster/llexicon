import React, { memo } from "react"
import PropTypes from "prop-types"
import { ColumnsPropType } from "../../../state/types"
import { isType } from "../../../../../../utils"

const TableDataCell = ({ scope, render, item, itemKey }) => {
  const itemValue = item[itemKey]
  const handleRender = render ? render(item) : itemValue
  const title =
    typeof handleRender === isType.STRING
      ? handleRender
      : typeof itemValue === isType.STRING
      ? itemValue
      : ""

  return scope === "row" ? (
    <th scope="row" title={title}>
      {handleRender}
    </th>
  ) : (
    <td title={title}>{handleRender}</td>
  )
}

TableDataCell.propTypes = {
  scope: PropTypes.string,
  render: PropTypes.func,
  item: PropTypes.object,
  itemKey: PropTypes.any,
  columns: ColumnsPropType,
}

export default memo(TableDataCell)
