import React, { useMemo, memo } from "react"
import PropTypes from "prop-types"
import { DataPropType, ColumnsPropType } from "../state/types"
import TableRow from "./TableRow"
import { connect } from "../../../../store/provider"

const mapStateToProps = ({ columns, onRowClick, currentPage, pageSize }) => ({
  columns,
  onRowClick,
  currentPage,
  pageSize,
})

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
  columns: ColumnsPropType,
  onRowClick: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
}

export default connect(mapStateToProps)(memo(TableBody))
