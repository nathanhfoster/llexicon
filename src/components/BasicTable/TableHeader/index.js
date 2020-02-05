import React, { useMemo, memo } from "react"
import PropTypes from "prop-types"
import { Input } from "reactstrap"
import { capitalizeFirstLetter } from "../../../helpers"
import { ColumnsPropType } from "../props"
import "./styles.css"

const TableHeader = ({
  columns,
  sortUp,
  sortCallback,
  sortable,
  sortKey,
  filterCallback
}) => {
  const handleSortCallback = (key, sort) => sortCallback(key, sort, !sortUp)

  const renderColumnHeaders = useMemo(() => {
    const shouldRenderSortContainer = columns.find(c => c.filter)
    return columns.map((column, i) => {
      const {
        title,
        dataIndex,
        key,
        width,
        render,
        sort,
        filter,
        filterPlaceholder
      } = column
      const titleFunction = typeof title === "function"
      const showSort = sortKey === key
      return (
        <th
          key={key}
          className={`BasicTableHeader ${sortable ? "HeaderHoverable" : ""} `}
          style={{ width }}
          // title={title}
          onClick={sortable ? () => handleSortCallback(key, sort) : null}
        >
          {titleFunction ? title(column) : title}
          {sortable && showSort && (
            <i className={`fas fa-sort-${sortUp ? "up" : "down"} ml-1`} />
          )}
          {shouldRenderSortContainer && (
            <div>
              <Input
                className="TableHeaderSortInput"
                disabled={!filter}
                onClick={e => e.stopPropagation()}
                onChange={({ target: { value } }) =>
                  filterCallback(dataIndex || key, value, filter)
                }
                placeholder={
                  filter
                    ? filterPlaceholder ||
                      `${capitalizeFirstLetter(dataIndex || key)} filter`
                    : null
                }
              />
            </div>
          )}
        </th>
      )
    })
  }, [columns, sortKey, sortUp])

  return (
    <thead>
      <tr>{renderColumnHeaders}</tr>
    </thead>
  )
}

TableHeader.propTypes = {
  sortable: PropTypes.bool.isRequired,
  sortCallback: PropTypes.func.isRequired,
  filterCallback: PropTypes.func.isRequired,
  columns: ColumnsPropType,
  sortKey: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  sortUp: PropTypes.bool
}

export default memo(TableHeader)
