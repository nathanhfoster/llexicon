import { BASIC_TABLE_CONTEXT_OPTIONS } from '../state/context'
import React, { useMemo } from 'react'
import { DataPropType, ColumnsPropType } from '../state/types'
import { connect } from 'react-redux'
import './styles.css'

const mapStateToProps = ({
  columns,
  sortedAndFilteredData,
  selectedDataMap,
  actionMenuCallback,
}) => ({
  columns,
  sortedAndFilteredData,
  selectedDataMap,
  actionMenuCallback,
})

const TableFooters = ({ columns, sortedAndFilteredData, selectedDataMap, actionMenuCallback }) => {
  const shouldRender = useMemo(() => columns.some(column => column.footer), [columns])

  const renderTableRows = useMemo(
    () =>
      columns.map((column, i) => {
        const { footer } = column

        return footer ? <td key={i}>{footer(sortedAndFilteredData)}</td> : <td key={i}></td>
      }),
    [columns, sortedAndFilteredData],
  )

  return (
    shouldRender && (
      <tfoot className='BasicTableFooter'>
        {actionMenuCallback && (
          <tr>
            <td>{Object.keys(selectedDataMap).length}</td>
          </tr>
        )}
        <tr>{renderTableRows}</tr>
      </tfoot>
    )
  )
}

TableFooters.propTypes = {
  sortedAndFilteredData: DataPropType,
  columns: ColumnsPropType,
}

export default connect(mapStateToProps, null, null, BASIC_TABLE_CONTEXT_OPTIONS)(TableFooters)
