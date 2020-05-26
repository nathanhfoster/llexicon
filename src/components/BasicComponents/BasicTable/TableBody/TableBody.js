import React, { useMemo, memo } from "react"
import PropTypes from "prop-types"
import { DataPropType } from "../state/types"
import TableRow from "./TableRow"

const TableBody = ({ data, columns, onRowClick, currentPage, pageSize }) => {
  const sliceStart = currentPage * pageSize

  const sliceEnd = sliceStart + pageSize

  const slicedData = useMemo(() => data.slice(sliceStart, sliceEnd), [
    data,
    sliceStart,
    sliceEnd,
  ])

  const renderTableRows = useMemo(
    () =>
      slicedData.map((item, i) => (
        <TableRow
          key={i}
          onRowClick={onRowClick}
          item={item}
          columns={columns}
        />
      )),
    [slicedData, columns]
  )
  return <tbody>{renderTableRows}</tbody>
}

TableBody.propTypes = {
  data: DataPropType,
}

export default memo(TableBody)
