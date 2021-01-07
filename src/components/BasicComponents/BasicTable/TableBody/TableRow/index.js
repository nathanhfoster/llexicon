import { BASIC_TABLE_CONTEXT_OPTIONS } from '../../state/context'
import React, { useState, useCallback, useMemo, Fragment } from 'react'
import PropTypes from 'prop-types'
import TableDataCell from './TableDataCell'
import { Collapse } from 'reactstrap'
import { ColumnsPropType } from '../../state/types'
import { connect } from 'react-redux'
import { isType } from 'utils'
import { selectDataItems } from '../../state/actions'

const getTitle = (key, item, render) => {
  const itemValue = item[key]
  if (typeof render === isType.STRING) {
    return render
  } else if (typeof render === isType.FUNCTION && typeof render(item) === isType.STRING) {
    return render(item)
  } else if (typeof itemValue === isType.STRING) {
    return itemValue
  }

  return ''
}

const mapStateToProps = (
  { getRowValue, onRowClick, columns, selectedDataMap, actionMenuCallback },
  { item },
) => ({
  getRowValue,
  onRowClick,
  columns,
  isSelected: selectedDataMap[item.id],
  actionMenuCallback,
})

const mapDispatchToProps = { selectDataItems }

const TableRow = ({
  getRowValue,
  onRowClick,
  item,
  columns,
  isSelected,
  actionMenuCallback,
  selectDataItems,
}) => {
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
  const title = getTitle(key, item, render)

  const renderRestOfColumns = useMemo(
    () =>
      (actionMenuCallback ? columns : restOfColumns).map((c, j) => {
        const { key, render } = c
        const itemValue = item[key]
        const title = getTitle(key, item, render)

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

      selectDataItems([item], !isSelected)
    },
    [actionMenuCallback, item, isSelected],
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
              checked={isSelected}
              onClick={e => e.stopPropagation()}
              onChange={handleActionMenuCallback}
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
          <TableDataCell colSpan={columns.length} title='Toggle'>
            <Collapse isOpen={open}>{getRowValue(item)}</Collapse>
          </TableDataCell>
        </tr>
      )}
    </Fragment>
  )
}

TableRow.propTypes = {
  getRowValue: PropTypes.func,
  onRowClick: PropTypes.func,
  item: PropTypes.object,
  columns: ColumnsPropType,
  isSelected: PropTypes.bool,
  actionMenuCallback: PropTypes.func,
  selectDataItems: PropTypes.func,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  BASIC_TABLE_CONTEXT_OPTIONS,
)(TableRow)
