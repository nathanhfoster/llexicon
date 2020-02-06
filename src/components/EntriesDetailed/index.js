import React, { useRef, memo } from "react"
import PropTypes from "prop-types"
import { Col } from "reactstrap"
import { FixedSizeList } from "react-window"
import Entry from "../../components/Entry"
import deepEquals from "../../helpers/deepEquals"

const renderDetailedEntries = ({ data, index, style, isScrolling }) => {
  const entry = data[index]

  return (
    <Col
      key={entry.id}
      style={{ ...style /* background: "red" */ }}
      xs={12}
      className="p-0"
    >
      <Entry
        entry={entry}
        containerHeight={style.height}
        bottomToolbarHidden
        theme="snow"
      />
    </Col>
  )
}

const EntriesDetailed = ({
  entries,
  onItemsRendered,
  height,
  width,
  itemSize
}) => {
  const detailedEntriesListRef = useRef()

  return (
    <FixedSizeList
      ref={detailedEntriesListRef}
      height={height}
      width={width}
      itemData={entries}
      itemCount={entries.length}
      itemSize={itemSize}
      onItemsRendered={onItemsRendered}
    >
      {renderDetailedEntries}
    </FixedSizeList>
  )
}

EntriesDetailed.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.object.isRequired),
  onItemsRendered: PropTypes.func,
  height: PropTypes.number.isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

EntriesDetailed.defaultProps = {
  height: 500,
  width: "100%",
  itemSize: 60
}

const isEqual = (prevProps, nextProps) => {
  const memoProps = ["entries", "height", "itemSize", "width"]
  for (let i = 0, { length } = memoProps; i < length; i++) {
    const prop = memoProps[i]
    if (!deepEquals(prevProps[prop], nextProps[prop])) {
      return false
    }
  }
  return true
}

export default memo(EntriesDetailed, isEqual)
