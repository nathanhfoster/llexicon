import React, { useCallback, useMemo, memo } from "react"
import PropTypes from "prop-types"
import { connect } from "../../../../store/provider"
import { ColumnsPropType, SortListPropType } from "../state/types"
import TableHeader from "./TableHeader"
import { basicTableSort, basicTableFilter } from "../state/actions"

const mapStateToProps = ({
  columns,
  sortList,
  onSortCallback,
  onFilterCallback,
  sortable,
}) => ({ columns, sortList, onSortCallback, onFilterCallback, sortable })

const mapDispatchToProps = { basicTableSort, basicTableFilter }

const TableHeaders = ({
  onSortCallback,
  onFilterCallback,
  sortable,
  columns,
  sortList,
  basicTableSort,
  basicTableFilter,
}) => {
  const handleFilter = useCallback((filterKey, filterValue) => {
    basicTableFilter(onFilterCallback, filterKey, filterValue)
  })

  const sortMap = useMemo(
    () =>
      sortList.reduce((map, item) => {
        const { key, ...restOfItem } = item
        map[key] = restOfItem
        return map
      }, {}),
    [sortList]
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
            sortable={sortable}
            sortUp={sortUp}
            sortCallback={sortCallback}
            filter={filter}
            filterPlaceholder={filterPlaceholder}
            defaultFilterValue={defaultFilterValue}
            filterCallback={handleFilter}
          />
        )
      }),
    [columns, sortList]
  )

  return (
    <thead>
      <tr>{renderColumnHeaders}</tr>
    </thead>
  )
}

TableHeaders.propTypes = {
  onSortCallback: PropTypes.func.isRequired,
  onFilterCallback: PropTypes.func.isRequired,
  sortable: PropTypes.bool.isRequired,
  columns: ColumnsPropType,
  sortList: SortListPropType,
}

export default connect(mapStateToProps, mapDispatchToProps)(memo(TableHeaders))
