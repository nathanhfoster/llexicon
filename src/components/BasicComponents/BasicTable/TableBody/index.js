import BasicTableContext from '../state/context'
import React, { useRef, useMemo } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { DataPropType, ColumnsPropType } from '../state/types'
import TableRow from './TableRow'
import TableDataCell from './TableRow/TableDataCell'

const mapStateToProps = ({
  sortedAndFilteredData,
  currentPage,
  pageSize,
  dataDisplayName,
  columns,
}) => ({
  sortedAndFilteredData,
  currentPage,
  pageSize,
  dataDisplayName,
  colSpan: columns.length,
})

const TableBody = ({ sortedAndFilteredData, currentPage, pageSize, dataDisplayName, colSpan }) => {
  const bodyRef = useRef()
  const sliceStart = currentPage * pageSize

  const sliceEnd = sliceStart + pageSize

  const slicedData = useMemo(() => {
    return sortedAndFilteredData.slice(sliceStart, sliceEnd)
  }, [sortedAndFilteredData, sliceStart, sliceEnd])

  let renderTableRows = useMemo(
    () => slicedData.map((item, i) => <TableRow key={i} item={item} />),
    [slicedData],
  )

  const renderNoDataRows = useMemo(() => {
    const empyRowHeight = bodyRef.current ? bodyRef.current.clientHeight / pageSize : 40

    const rowDifference = pageSize - slicedData.length
    const isARowDifference = rowDifference !== pageSize
    const remainingRows = rowDifference - 1 >= 0 ? rowDifference - 1 : 0

    let emptyRows = [
      <tr
        style={{
          height: empyRowHeight,
          pointerEvents: 'none',
        }}
      >
        <TableDataCell scope='row' colSpan={colSpan}>
          <span className='Center'>{`No ${
            isARowDifference ? 'More' : ''
          } ${dataDisplayName} Found`}</span>
        </TableDataCell>
      </tr>,
    ].concat(
      new Array(remainingRows).fill(
        <tr
          style={{
            height: empyRowHeight,
            pointerEvents: 'none',
          }}
        />,
      ),
    )

    return emptyRows
  }, [bodyRef.current, slicedData, colSpan])

  if (renderTableRows.length < pageSize) {
    renderTableRows = renderTableRows.concat(renderNoDataRows)
  }

  return <tbody ref={bodyRef}>{renderTableRows}</tbody>
}

TableBody.propTypes = {
  dataDisplayName: PropTypes.string.isRequired,
  sortedAndFilteredData: DataPropType,
  columns: ColumnsPropType,
  onRowClick: PropTypes.func,
  currentPage: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  colSpan: PropTypes.number,
}

export default connect(mapStateToProps, null, null, {
  context: BasicTableContext,
})(TableBody)
