import React, { useMemo, memo } from "react"
import PropTypes from "prop-types"
import { Input } from "reactstrap"
import { capitalizeFirstLetter, isType } from "../../../helpers"
import { ColumnsPropType } from "../propTypes"
import "./styles.css"

const TableHeader = ({
  columns,
  sortCallback,
  sortable,
  sortList,
  filterCallback,
}) => {
  const sortMap = sortList.reduce((map, item) => {
    const { key, ...restOfItem } = item
    map[key] = restOfItem
    return map
  }, {})

  const renderColumnHeaders = useMemo(() => {
    const shouldRenderSortContainer = columns.find((c) => c.filter)
    return columns.map((column, i) => {
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
      const titleFunction = typeof title === "function"
      const { sortUp } = sortMap[key]
      const shouldShowSortIcon = typeof sortUp === isType.BOOLEAN

      const handleSort = () => {
        if (sortUp === false) {
          sortCallback(key, null)
        } else {
          sortCallback(key, !sortUp)
        }
      }

      return (
        <th
          key={key}
          className={`BasicTableHeader px-1 ${
            sortable ? "HeaderHoverable" : ""
          } `}
          style={{ width }}
          title={typeof title === "string" ? title : key}
          onClick={sortable ? handleSort : null}
        >
          <div className="ml-1">
            {titleFunction ? title(column) : title}
            {sortable && shouldShowSortIcon && (
              <i className={`fas fa-sort-${sortUp ? "up" : "down"} ml-1`} />
            )}
          </div>

          {shouldRenderSortContainer && (
            <Input
              className="TableHeaderSortInput"
              defaultValue={defaultFilterValue}
              disabled={!filter}
              onClick={(e) => e.stopPropagation()}
              onChange={({ target: { value } }) => filterCallback(key, value)}
              placeholder={
                filter
                  ? filterPlaceholder || `${capitalizeFirstLetter(key)} filter`
                  : null
              }
            />
          )}
        </th>
      )
    })
  }, [columns, sortList])

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
  sortList: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      sortUp: PropTypes.oneOf([false, true, null]),
    })
  ).isRequired,
}

export default memo(TableHeader)
