import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { Input } from "reactstrap"
import { capitalizeFirstLetter } from "../../../helpers"
import { ColumnsPropType } from "../props"
import "./styles.css"

class TableHeader extends PureComponent {
  constructor(props) {
    super(props)

    this.state = { sortKey: null, sortUp: false }
  }

  static propTypes = {
    sortable: PropTypes.bool.isRequired,
    sortCallback: PropTypes.func.isRequired,
    filterCallback: PropTypes.func.isRequired,
    columns: ColumnsPropType
  }

  static defaultProps = {}

  static getDerivedStateFromProps(nextProps, prevState) {
    const { columns } = nextProps
    const { sortKey, sortUp } = prevState
    return { columns, sortKey, sortUp }
  }

  handleSortCallback = (key, sort) => {
    const { sortCallback } = this.props

    this.setState(currentState => {
      const shouldToggle = currentState.sortKey === key
      if (shouldToggle) {
        const sortUp = !currentState.sortUp
        sortCallback(key, sort, sortUp)
        return { sortUp }
      } else {
        const sortUp = !currentState.sortUp
        sortCallback(key, sort, sortUp)
        return {
          sortKey: key,
          sortUp
        }
      }
    })
  }

  renderColumnHeaders = columns => {
    const { sortable, filterCallback } = this.props
    const { sortKey, sortUp } = this.state
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
            <div style={{}}>
              <Input
                className="TableHeaderSortInput"
                disabled={!filter}
                onClick={e => e.stopPropagation()}
                onChange={e =>
                  filterCallback(dataIndex || key, e.target.value, filter)
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
    const { columns } = this.state
    return (
      <thead>
        <tr>{this.renderColumnHeaders(columns)}</tr>
      </thead>
    )
  }
}
export default TableHeader
