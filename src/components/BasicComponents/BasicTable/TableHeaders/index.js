import { BASIC_TABLE_CONTEXT_OPTIONS } from '../state/context'
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
  pageSize,
  currentPage,
  selectedDataMap,
  actionMenuCallback,
}) => ({
  columns,
  sortList,
  onSortCallback,
  onFilterCallback,
  sortable,
  filterable,
  sortedAndFilteredData,
  pageSize,
  currentPage,
  selectedDataMap,
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
  pageSize,
  currentPage,
  selectedDataMap,
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

  const selectedDataMapLength = Object.keys(selectedDataMap).length

  const slicedData = useMemo(() => sortedAndFilteredData.slice(sliceStart, sliceEnd), [
    sortedAndFilteredData,
    sliceStart,
    sliceEnd,
  ])

  const allDataIsSelected = useMemo(
    () =>
      sortedAndFilteredData.length !== 0 && sortedAndFilteredData.length === selectedDataMapLength,
    [selectedDataMap, sortedAndFilteredData.length],
  )

  const allSlicedDataIsSelected = useMemo(
    () => slicedData.length > 0 && slicedData.every(({ id }) => selectedDataMap[id]),
    [slicedData, selectedDataMap],
  )

  const handleActionMenuCallback = useCallback(() => {
    if (!allSlicedDataIsSelected) {
      selectDataItems(slicedData)
    } else if (allSlicedDataIsSelected && !allDataIsSelected) {
      selectDataItems(sortedAndFilteredData)
    } else if (allDataIsSelected) {

      selectDataItems(sortedAndFilteredData, false)
    }
  }, [allDataIsSelected, allSlicedDataIsSelected, slicedData, sortedAndFilteredData])

  return (
    <thead>
      <tr>
        {actionMenuCallback && (
          <Fragment>
            <th title='SelectAll' onClick={e => e.stopPropagation()} style={{ width: 50 }}>
              <div>{selectedDataMapLength}</div>
              <input
                disabled={sortedAndFilteredData.length === 0 || slicedData.length === 0}
                type='checkbox'
                checked={allSlicedDataIsSelected || allDataIsSelected}
                onClick={e => e.stopPropagation()}
                onChange={handleActionMenuCallback}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  BASIC_TABLE_CONTEXT_OPTIONS,
)(TableHeaders)
