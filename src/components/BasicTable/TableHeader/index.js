import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { Input } from "reactstrap"
import { capitalizeFirstLetter } from "../../../helpers"
import { ColumnsPropType } from "../props"
import "./styles.css"

class TableHeader extends PureComponent {
  static propTypes = {
    sortable: PropTypes.bool.isRequired,
    sortCallback: PropTypes.func.isRequired,
    filterCallback: PropTypes.func.isRequired,
    columns: ColumnsPropType,
    sortKey: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    sortUp: PropTypes.bool
  }

  static defaultProps = {}

  handleSortCallback = (key, sort) => {
    const { sortUp, sortCallback } = this.props

    sortCallback(key, sort, !sortUp)
  }

  renderColumnHeaders = columns => {
    const { sortable, sortKey, sortUp, filterCallback } = this.props
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
          onClick={sortable ? () => this.handleSortCallback(key, sort) : null}
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
  }

  render() {
    const { columns } = this.props
    return (
      <thead>
        <tr>{this.renderColumnHeaders(columns)}</tr>
      </thead>
    )
  }
}
export default TableHeader
