import React, { useCallback, memo } from "react"
import PropTypes from "prop-types"
import { DebounceInput } from "../../../../"
import { capitalizeFirstLetter, isType } from "../../../../../utils"
import { ColumnPropType } from "../../state/types"
import "./styles.css"

const TableHeader = ({
  headerKey,
  title,
  width,
  column,
  sortable,
  filterable,
  sortUp,
  sortCallback,
  filter,
  filterPlaceholder,
  defaultFilterValue,
  filterCallback,
}) => {
  const handleDebounce = useCallback(
    (filterValue) => filterCallback(headerKey, filterValue),
    [headerKey]
  )

  const headerTitle = typeof title === isType.STRING ? title : headerKey
  const titleFunction =
    typeof title === isType.FUNCTION || title instanceof Function
  const shouldShowSortIcon = typeof sortUp === isType.BOOLEAN
  const headerStyles = { width }

  return (
    <th
      className={`BasicTableHeader px-1 ${sortable ? "HeaderHoverable" : ""} `}
      style={headerStyles}
      title={headerTitle}
      onClick={sortable ? sortCallback : null}
    >
      <div className="ml-1">
        {titleFunction ? title(column) : title || headerKey}
        {sortable && shouldShowSortIcon && (
          <i className={`fas fa-sort-${sortUp ? "up" : "down"} ml-1`} />
        )}
      </div>
      <DebounceInput
        className="TableHeaderSortInput"
        defaultValue={defaultFilterValue}
        disabled={!(filter || filterable)}
        onClick={(e) => e.stopPropagation()}
        onChange={handleDebounce}
        placeholder={
          filterable
            ? filterPlaceholder || `${capitalizeFirstLetter(headerKey)}`
            : null
        }
      />
    </th>
  )
}

TableHeader.propTypes = {
  headerKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  column: ColumnPropType,
  sortable: PropTypes.bool.isRequired,
  filterable: PropTypes.bool.isRequired,
  sortUp: PropTypes.oneOf([true, false, null, undefined]),
  sortCallback: PropTypes.func.isRequired,
  filter: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  filterPlaceholder: PropTypes.string,
  defaultFilterValue: PropTypes.string,
  filterCallback: PropTypes.func.isRequired,
}

export default memo(TableHeader)
