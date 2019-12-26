import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import "./styles.css"

class Header extends PureComponent {
  constructor(props) {
    super(props)

    this.state = { sortKey: null, sortUp: false }
  }

  static propTypes = {
    sortable: PropTypes.bool.isRequired,
    sortCallback: PropTypes.func,
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
          PropTypes.func
        ]),
        dataIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        render: PropTypes.func,
        onRowClick: PropTypes.func
      })
    )
  }

  static defaultProps = {}

  static getDerivedStateFromProps(nextProps, prevState) {
    const { columns } = nextProps
    const { sortKey, sortUp } = prevState
    return { columns, sortKey, sortUp }
  }

  handleSortCallback = key => {
    const { sortCallback } = this.props

    this.setState(currentState => {
      const shouldToggle = currentState.sortKey === key
      if (shouldToggle) {
        const sortUp = !currentState.sortUp
        sortCallback(key, sortUp)
        return { sortUp }
      } else {
        const sortUp = !currentState.sortUp
        sortCallback(key, sortUp)
        return {
          sortKey: key,
          sortUp
        }
      }
    })
  }

  renderColumnHeaders = columns => {
    const { sortable } = this.props
    const { sortKey, sortUp } = this.state
    return columns.map((column, i) => {
      const { title, dataIndex, key, width, render } = column
      const titleFunction = typeof title === "function"
      const showSort = sortKey === key
      return (
        <th
          key={key}
          className={`BasicTableHeader ${sortable ? "HeaderHoverable" : ""} `}
          style={{ width }}
          title={title}
          onClick={sortable ? () => this.handleSortCallback(key) : null}
        >
          {titleFunction ? title(column) : title}
          {sortable && showSort && (
            <i className={`fas fa-sort-${sortUp ? "up" : "down"} ml-1`} />
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
export default Header
