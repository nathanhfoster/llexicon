import React, { useRef, useCallback, memo } from "react"
import PropTypes from "prop-types"
import { FixedSizeList } from "react-window"
import "./styles.css"

const BasicList = ({
  itemSize,
  listPosition,
  list,
  height,
  width,
  onListItemClickCallback,
  onScrollToBottomOfListCallback,
  listItemHoverable,
  containerClass,
  containerStyles,
  listItemStyles
}) => {
  const listRef = useRef()

  const styles = { position: listPosition, ...containerStyles }

  const renderList = ({ data, index, style, isScrolling }) => {
    const { id, value, otherValue } = data[index]

    const onListItemClick = useCallback(() => {
      if (onListItemClickCallback) {
        onListItemClickCallback(id, value)
      }
    }, [id, value])

    return typeof value === "object" ? (
      value
    ) : (
      <div
        key={id}
        className={`basicListItem ${listItemHoverable &&
          "basicListItemHoverable"}`}
        style={{ ...style, padding: itemSize / 4, ...listItemStyles }}
        id={id}
        value={value}
        onClick={onListItemClick}
      >
        <span className="basicListItemValue FirstValue">{value}</span>
        {otherValue && (
          <span className="basicListItemValue OtherValue">{otherValue}</span>
        )}
      </div>
    )
  }

  const handleItemsRendered = ({
    overscanStartIndex,
    overscanStopIndex,
    visibleStartIndex,
    visibleStopIndex
  }) => {
    if (!onScrollToBottomOfListCallback) return
    const listLength = list.length
    const bottomOfListIndex = listLength === 0 ? listLength : listLength - 1
    const reachedBottomOfList =
      bottomOfListIndex !== 0 && overscanStopIndex === bottomOfListIndex
    // console.log("overscanStopIndex: ", overscanStopIndex)
    // console.log("visibleStopIndex: ", visibleStopIndex)
    // console.log('reachedBottomOfList: ', reachedBottomOfList)
    // console.log('---------------------------------------')

    reachedBottomOfList && onScrollToBottomOfListCallback()
  }

  return (
    <FixedSizeList
      ref={listRef}
      className={`basicListContainer fade-in ${containerClass}`}
      style={styles}
      height={height}
      width={width}
      itemData={list}
      itemCount={list.length}
      itemSize={itemSize}
      onItemsRendered={handleItemsRendered}
    >
      {renderList}
    </FixedSizeList>
  )
}

BasicList.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.any.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
        .isRequired,
      otherValue: PropTypes.any
    }).isRequired
  ),

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
    "inherit"
  ]),
  containerClass: PropTypes.string,
  containerStyles: PropTypes.object,
  listItemStyles: PropTypes.object,

  // Callback props
  onListItemClickCallback: PropTypes.func, // When an item is clicked
  onScrollToBottomOfListCallback: PropTypes.func // When scrolled to the bottom of the list,
}

BasicList.defaultProps = {
  maxHeight: 250,
  height: 250,
  width: "100%",
  itemSize: 25,
  list: [],
  listPosition: "absolute",
  listItemHoverable: false,
  containerStyles: {},
  listItemStyles: {}
}
export default memo(BasicList)
