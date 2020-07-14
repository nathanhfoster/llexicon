import React, { useMemo, memo } from "react"
import PropTypes from "prop-types"
import { DataPropType, ColumnsPropType } from "../state/types"
import TableRow from "./TableRow"
import TableDataCell from "./TableRow/TableDataCell"
import { connect } from "../../../../store/provider"

const mapStateToProps = ({
  currentPage,
  pageSize,
  dataDisplayName,
  columns,
}) => ({
  currentPage,
  pageSize,
  dataDisplayName,
  colSpan: columns.length,
})

const TableBody = ({
  data,
  currentPage,
  pageSize,
  dataDisplayName,
  colSpan,
}) => {
  const sliceStart = currentPage * pageSize

  const sliceEnd = sliceStart + pageSize

  const slicedData = useMemo(() => data.slice(sliceStart, sliceEnd), [
    data,
    sliceStart,
    sliceEnd,
  ])

  const renderTableRows = useMemo(
    () => slicedData.map((item, i) => <TableRow key={i} item={item} />),
    [slicedData]
  )

  return (
    <tbody>
      {renderTableRows}
      {slicedData.length === 0 && (
        <tr>
          <TableDataCell scope="row" colSpan={colSpan}>
            <span className="Center">{`No ${dataDisplayName} Found`}</span>
          </TableDataCell>
        </tr>
      )}
    </tbody>
  )
}

TableBody.propTypes = {
  dataDisplayName: PropTypes.string.isRequired,
  data: DataPropType,
  columns: ColumnsPropType,
  onRowClick: PropTypes.func,
  currentPage: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  colSpan: PropTypes.number,
}

export default connect(mapStateToProps)(memo(TableBody))
