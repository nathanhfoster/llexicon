import React, { useMemo, memo, useCallback } from "react"
import PropTypes from "prop-types"
import TableHeader from "./TableHeader"
import { Input } from "reactstrap"
import { capitalizeFirstLetter, isType } from "../../../helpers"
import { ColumnsPropType } from "../propTypes"

const TableHeaders = ({
  columns,
  sortCallback,
  sortable,
  sortList,
  filterCallback,
}) => {
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
        const handleSort = () => {
          if (sortUp === false) {
            sortCallback(key, null)
          } else {
            sortCallback(key, !sortUp)
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
            sortCallback={handleSort}
            filter={filter}
            filterPlaceholder={filterPlaceholder}
            defaultFilterValue={defaultFilterValue}
            filterCallback={filterCallback}
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
  sortable: PropTypes.bool.isRequired,
  sortCallback: PropTypes.func.isRequired,
  filterCallback: PropTypes.func.isRequired,
  columns: ColumnsPropType,
  sortList: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      sortUp: PropTypes.oneOf([false, true, null]),
    })
  ).isRequired,
}

export default memo(TableHeaders)
