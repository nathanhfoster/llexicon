import BasicTableContext from '../state/context'
import React, { Fragment, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ColumnsPropType, SortListPropType } from '../state/types'
import TableHeader from './TableHeader'
import { basicTableSort, basicTableFilter, selectDataItems } from '../state/actions'

const mapStateToProps = ({
  columns,
  sortList,
  onSortCallback,
  onFilterCallback,
  sortable,
  filterable,
  sortedAndFilteredData,
  selectedData,
  pageSize,
  currentPage,
  actionMenuCallback,
}) => ({
  columns,
  sortList,
  onSortCallback,
  onFilterCallback,
  sortable,
  filterable,
  sortedAndFilteredData,
  selectedData,
  pageSize,
  currentPage,
  actionMenuCallback,
})

const mapDispatchToProps = { basicTableSort, basicTableFilter, selectDataItems }

const TableHeaders = ({
  onSortCallback,
  onFilterCallback,
  sortable,
  filterable,
  columns,
  sortList,
  basicTableSort,
  basicTableFilter,
  sortedAndFilteredData,
  selectedData,
  pageSize,
  currentPage,
  actionMenuCallback,
  selectDataItems,
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

  const sliceStart = currentPage * pageSize

  const sliceEnd = sliceStart + pageSize

  const slicedData = useMemo(() => sortedAndFilteredData.slice(sliceStart, sliceEnd), [
    sortedAndFilteredData,
    sliceStart,
    sliceEnd,
  ])

  const allDataIsSelected = useMemo(
    () =>
      sortedAndFilteredData.length !== 0 && sortedAndFilteredData.length === selectedData.length,
    [selectedData, sortedAndFilteredData.length],
  )

  const allSlicedDataIsSelected = useMemo(
    () => slicedData.length > 0 && slicedData.every(({ _dataSelected }) => _dataSelected),
    [slicedData],
  )

  const handleActionMenuCallback = useCallback(
    e => {
      e.stopPropagation()
      if (!allSlicedDataIsSelected) {
        selectDataItems(selectedData.concat(slicedData))
      } else if (allSlicedDataIsSelected && !allDataIsSelected) {
        selectDataItems(sortedAndFilteredData)
      } else if (allDataIsSelected) {
        selectDataItems(sortedAndFilteredData, false)
      }
    },
    [
      selectedData,
      allDataIsSelected,
      allSlicedDataIsSelected,
      selectDataItems,
      slicedData,
      sortedAndFilteredData,
    ],
  )

  return (
    <thead>
      <tr>
        {actionMenuCallback && (
          <Fragment>
            <th title='SelectAll' onClick={e => e.stopPropagation()} style={{ width: 50 }}>
              <div>{selectedData.length}</div>
              <input
                disabled={sortedAndFilteredData.length === 0 || slicedData.length === 0}
                type='checkbox'
                checked={allSlicedDataIsSelected || allDataIsSelected}
                onClick={handleActionMenuCallback}
              />
            </th>
          </Fragment>
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
