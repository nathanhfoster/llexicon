import React, { useMemo, memo } from "react"
import PropTypes from "prop-types"
import { ColumnsPropType, DataPropType } from "../propTypes"
import TableRow from "./TableRow"

const TableBody = ({ columns, data, onRowClick }) => {
  const renderTableRows = useMemo(
    () =>
      data.map((item, i) => (
        <TableRow
          key={i}
          onRowClick={onRowClick}
          item={item}
          columns={columns}
        />
      )),
    [columns, data]
  )
  return <tbody>{renderTableRows}</tbody>
}

TableBody.propTypes = {
  onRowClick: PropTypes.func,
  columns: ColumnsPropType,
  data: DataPropType,
}

export default memo(TableBody)
