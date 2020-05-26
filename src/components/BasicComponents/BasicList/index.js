import React, { PureComponent, createRef, Fragment } from "react"
import PropTypes from "prop-types"
import { FixedSizeList } from "react-window"
import "./styles.css"

class BasicList extends PureComponent {
  constructor(props) {
    super(props)

    this.listRef = createRef()
  }

  static propTypes = {
    className: PropTypes.string,
    list: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        value: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
          PropTypes.node,
        ]),
        otherValue: PropTypes.any,
      })
    ),
    render: PropTypes.func,

    maxHeight: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    itemSize: PropTypes.number.isRequired,
    listPosition: PropTypes.oneOf([
      "static",
      "absolute",
      "fixed",
      "relative",
      "sticky",
      "initial",
      "inherit",
    ]),
    listItemHoverable: PropTypes.bool,
    listItemStyles: PropTypes.object,
    layout: PropTypes.oneOf(["vertical", "horizontal"]),

    // Callback props
    onListItemClickCallback: PropTypes.func, // When an item is clicked
    onScrollToBottomOfListCallback: PropTypes.func, // When scrolled to the bottom of the list,
  }

  static defaultProps = {
    className: "",
    maxHeight: 250,
    height: 250,
    width: "100%",
    itemSize: 25,
    list: [],
    listPosition: "absolute",
    listItemHoverable: false,
    listItemStyles: {},
    layout: "vertical",
  }

  renderList = ({ data, index, style, isScrolling }) => {
    const { id, value, otherValue } = data[index]

    const {
      onListItemClickCallback,
      listItemHoverable,
      itemSize,
      listItemStyles,
    } = this.props

    const onListItemClick = () => {
      if (onListItemClickCallback) {
        onListItemClickCallback(id, value)
      }
    }

    return (
      <div
        key={id}
        className={`basicListItem ${
          listItemHoverable && "basicListItemHoverable"
        }`}
        style={{ ...style, padding: itemSize / 4, ...listItemStyles }}
        id={id}
        value={value}
        onClick={onListItemClick}
      >
        {typeof value === "object" ? (
          value
        ) : (
          <Fragment>
            <span className="Overflow FirstValue">{value}</span>
            {otherValue && (
              <span className="Overflow OtherValue">{otherValue}</span>
            )}
          </Fragment>
        )}
      </div>
    )
  }

  handleItemsRendered = ({
    overscanStartIndex,
    overscanStopIndex,
    visibleStartIndex,
    visibleStopIndex,
  }) => {
    const { onScrollToBottomOfListCallback, list } = this.props

    if (!onScrollToBottomOfListCallback) return
    const { length } = list
    const bottomOfListIndex = length === 0 ? length : length - 1
    const reachedBottomOfList =
      bottomOfListIndex !== 0 && overscanStopIndex === bottomOfListIndex
    // console.log("overscanStopIndex: ", overscanStopIndex)
    // console.log("visibleStopIndex: ", visibleStopIndex)
    // console.log('reachedBottomOfList: ', reachedBottomOfList)
    // console.log('---------------------------------------')

    reachedBottomOfList && onScrollToBottomOfListCallback()
  }

  render() {
    const {
      className,
      itemSize,
      listPosition,
      list,
      height,
      width,
      layout,
      render,
    } = this.props
    const styles = {
      position: render ? "relative" : listPosition,
      overflowX: "hidden",
      overflowY: "auto",
    }
    return (
      <FixedSizeList
        ref={this.listRef}
        className={`${className} basicListContainer`}
        style={styles}
        height={height}
        width={width}
        itemData={list}
        itemCount={list.length}
        itemSize={itemSize}
        onItemsRendered={this.handleItemsRendered}
        layout={layout}
      >
        {render || this.renderList}
      </FixedSizeList>
    )
  }
}

export default BasicList
