import BasicTableContext from '../state/context'
import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ColumnsPropType, SortListPropType } from '../state/types'
import TableHeader from './TableHeader'
import { basicTableSort, basicTableFilter, selectAllData } from '../state/actions'
import { isAFunction } from 'utils'

const mapStateToProps = ({
  columns,
  sortList,
  onSortCallback,
  onFilterCallback,
  sortable,
  filterable,
  data,
  actionMenuCallback,
}) => ({
  columns,
  sortList,
  onSortCallback,
  onFilterCallback,
  sortable,
  filterable,
  data,
  actionMenuCallback,
})

const mapDispatchToProps = { basicTableSort, basicTableFilter, selectAllData }

const TableHeaders = ({
  onSortCallback,
  onFilterCallback,
  sortable,
  filterable,
  columns,
  sortList,
  basicTableSort,
  basicTableFilter,
  data,
  actionMenuCallback,
  selectAllData,
}) => {
  const handleFilter = useCallback(
    (filterKey, filterValue) => {
      basicTableFilter(onFilterCallback, filterKey, filterValue)
    },
    [basicTableFilter, onFilterCallback],
  )

  const sortMap = useMemo(
    () =>
      sortList.reduce((map, item) => {
        const { key, ...restOfItem } = item
        map[key] = restOfItem
        return map
      }, {}),
    [sortList],
  )

  const renderColumnHeaders = useMemo(
    () =>
      columns.map((column, i) => {
        const {
          title,
          key,
          width,
          render,
          sort,
          filter,
          filterPlaceholder,
          defaultSortValue,
          defaultFilterValue,
          filterValue,
        } = column
        const isSortable = sortable || Boolean(sort)
        const isFilterable = filterable || Boolean(filter)

        const { sortUp } = sortMap[key]
        const sortCallback = () => {
          if (sortUp === false) {
            basicTableSort(onSortCallback, key, null)
          } else {
            basicTableSort(onSortCallback, key, !sortUp)
          }
        }

        return (
          <TableHeader
            key={key}
            headerKey={key}
            title={title}
            width={width}
            column={column}
            sortable={isSortable}
            filterable={isFilterable}
            sortUp={sortUp}
            sortCallback={sortCallback}
            filter={filter}
            filterPlaceholder={filterPlaceholder}
            defaultFilterValue={defaultFilterValue}
            filterCallback={handleFilter}
          />
        )
      }),
    [basicTableSort, columns, filterable, handleFilter, onSortCallback, sortMap, sortable],
  )

  const allDataIsSelected = useMemo(() => data.every(({ _dataSelected }) => _dataSelected), [data])

  const handleActionMenuCallback = useCallback(
    e => {
      e.stopPropagation()
      if (isAFunction(actionMenuCallback)) {
        actionMenuCallback(data, !allDataIsSelected)
        selectAllData()
      }
    },
    [data, allDataIsSelected, actionMenuCallback],
  )

  return (
    <thead>
      <tr>
        {actionMenuCallback && (
          <th title='SelectAll' onClick={e => e.stopPropagation()} style={{ width: 40 }}>
            <input type='checkbox' checked={allDataIsSelected} onClick={handleActionMenuCallback} />
          </th>
        )}
        {renderColumnHeaders}
      </tr>
    </thead>
  )
}

TableHeaders.propTypes = {
  onSortCallback: PropTypes.func,
  onFilterCallback: PropTypes.func,
  sortable: PropTypes.bool.isRequired,
  columns: ColumnsPropType,
  sortList: SortListPropType,
}

export default connect(mapStateToProps, mapDispatchToProps, null, {
  context: BasicTableContext,
})(TableHeaders)
