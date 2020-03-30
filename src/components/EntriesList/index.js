import React, { useRef, memo } from "react"
import PropTypes from "prop-types"
import { Col } from "reactstrap"
import { FixedSizeList } from "react-window"
import EntryMinimal from "../EntryMinimal"
import deepEquals from "../../helpers/deepEquals"

const renderMinimalEntries = ({ data, index, style, isScrolling }) => {
  const entry = data[index]
  return (
    <Col key={entry.id} xs={12} style={style} className="px-0 py-1">
      <EntryMinimal {...entry} />
    </Col>
  )
}

const EntriesList = ({ onItemsRendered, height, width, itemSize, entries }) => {
  const minimalEntriesListRef = useRef()

  return (
    <FixedSizeList
      ref={minimalEntriesListRef}
      height={height}
      width={width}
      itemData={entries}
      itemCount={entries.length}
      itemSize={itemSize}
      onItemsRendered={onItemsRendered}
    >
      {renderMinimalEntries}
    </FixedSizeList>
  )
}

EntriesList.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.object.isRequired),
  onItemsRendered: PropTypes.func,
  height: PropTypes.number.isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

EntriesList.defaultProps = {
  height: 500,
  width: "100%",
  itemSize: 110
}

const isEqual = (prevProps, nextProps) => deepEquals(prevProps, nextProps)

export default memo(EntriesList, isEqual)
