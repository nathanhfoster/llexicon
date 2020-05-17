import React, { useCallback, useState, memo } from "react"
import PropTypes from "prop-types"
import { Input } from "reactstrap"
import { UseDebounce } from "../../../"
import { capitalizeFirstLetter, isType } from "../../../../utils"
import { ColumnPropType } from "../../state/types"
import "./styles.css"

const TableHeader = ({
  headerKey,
  title,
  width,
  column,
  sortable,
  sortUp,
  sortCallback,
  filter,
  filterPlaceholder,
  defaultFilterValue,
  filterCallback,
}) => {
  const [filterValue, setFilterValue] = useState(defaultFilterValue || "")
  const handleChange = ({ target: { value } }) => setFilterValue(value)
  const handleDebounce = useCallback(
    () => filterCallback(headerKey, filterValue),
    [filterValue, headerKey]
  )

  const headerTitle = typeof title === isType.STRING ? title : headerKey
  const titleFunction = typeof title === isType.FUNCTION
  const shouldShowSortIcon = typeof sortUp === isType.BOOLEAN

  return (
    <th
      className={`BasicTableHeader px-1 ${sortable ? "HeaderHoverable" : ""} `}
      style={{ width }}
      title={headerTitle}
      onClick={sortable ? sortCallback : null}
    >
      <div className="ml-1">
        {titleFunction ? title(column) : title}
        {sortable && shouldShowSortIcon && (
          <i className={`fas fa-sort-${sortUp ? "up" : "down"} ml-1`} />
        )}
      </div>
      <UseDebounce onChangeCallback={handleDebounce} value={filterValue} />
      <Input
        className="TableHeaderSortInput"
        value={filterValue}
        disabled={!filter}
        onClick={(e) => e.stopPropagation()}
        onChange={handleChange}
        placeholder={
          filter
            ? filterPlaceholder || `${capitalizeFirstLetter(headerKey)} filter`
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
  sortUp: PropTypes.oneOf([true, false, null, undefined]),
  sortCallback: PropTypes.func.isRequired,
  filter: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  filterPlaceholder: PropTypes.string,
  defaultFilterValue: PropTypes.string,
  filterCallback: PropTypes.func.isRequired,
}

export default memo(TableHeader)
