import BasicTableContext from '../../state/context'
import React, { useState, useCallback, useMemo, Fragment } from 'react'
import PropTypes from 'prop-types'
import TableDataCell from './TableDataCell'
import { Collapse } from 'reactstrap'
import { ColumnsPropType } from '../../state/types'
import { connect } from 'react-redux'
import { isType } from '../../../../../utils'
import { isAFunction } from 'utils'
import { selectData } from '../../state/actions'

const mapStateToProps = ({ getRowValue, onRowClick, columns, actionMenuCallback }) => ({
  getRowValue,
  onRowClick,
  columns,
  actionMenuCallback,
})

const mapDispatchToProps = { selectData }

const TableRow = ({ getRowValue, onRowClick, item, columns, actionMenuCallback, selectData }) => {
  const [open, setOpen] = useState(false)
  const handleRowClick = useCallback(
    e => {
      e.stopPropagation()
      onRowClick && onRowClick(item, open)
      getRowValue && setOpen(prevOpen => !prevOpen)
    },
    [getRowValue, item, onRowClick, open],
  )

  const [firstColumn, ...restOfColumns] = columns
  const { key, render } = firstColumn
  const itemValue = item[key]
  const title =
    typeof render === isType.STRING ? render : typeof itemValue === isType.STRING ? itemValue : ''

  const renderRestOfColumns = useMemo(
    () =>
      (actionMenuCallback ? columns : restOfColumns).map((c, j) => {
        const { key, render } = c
        const itemValue = item[key]
        const title =
          typeof render === isType.STRING
            ? render
            : typeof itemValue === isType.STRING
            ? itemValue
            : ''

        return (
          <TableDataCell key={j} title={title}>
            {render ? render(item) : itemValue}
          </TableDataCell>
        )
      }),
    [actionMenuCallback, columns, item, restOfColumns],
  )

  const handleActionMenuCallback = useCallback(
    e => {
      e.stopPropagation()
      if (isAFunction(actionMenuCallback)) {
        actionMenuCallback([item], !item._dataSelected)
        selectData(item.id)
      }
    },
    [item, actionMenuCallback],
  )

  return (
    <Fragment>
      <tr onClick={handleRowClick}>
        <TableDataCell
          scope={actionMenuCallback ? 'row' : null}
          title={actionMenuCallback ? 'checkbox' : title}
        >
          {actionMenuCallback ? (
            <input
              type='checkbox'
              checked={item._dataSelected}
              onClick={handleActionMenuCallback}
            />
          ) : render ? (
            render(item)
          ) : (
            itemValue
          )}
        </TableDataCell>

        {renderRestOfColumns}
      </tr>
      {open && getRowValue && (
        <tr>
          <TableDataCell colSpan={columns.length}>
            <Collapse isOpen={open}>{getRowValue(item)}</Collapse>
          </TableDataCell>
        </tr>
      )}
    </Fragment>
  )
}

TableRow.propTypes = {
  onRowClick: PropTypes.func,
  item: PropTypes.object,
  columns: ColumnsPropType,
}

export default connect(mapStateToProps, mapDispatchToProps, null, {
  context: BasicTableContext,
})(TableRow)
