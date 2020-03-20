import React, { useState, useEffect, useMemo, memo } from "react"
import PropTypes from "prop-types"
import { FixedSizeGrid as Grid } from "react-window"

const Cell = ({ columnIndex, rowIndex, style, ...rest }) => {
  console.log(rest)
  return (
    <div style={style}>
      Item {rowIndex},{columnIndex}
    </div>
  )
}

const BasicGrid = props => {
  console.log(props)
  return null
  return <Grid {...props}>{Cell}</Grid>
}

BasicGrid.propTypes = {
  scrollTo: PropTypes.func,
  scrollToItem: PropTypes.func,
  columnWidth: PropTypes.number,
  rowHeight: PropTypes.number,
  children: PropTypes.object,
  columnCount: PropTypes.number,
  direction: PropTypes.oneOf(["ltr", "rtl"]),
  height: PropTypes.number,
  initialScrollLeft: PropTypes.number,
  initialScrollTop: PropTypes.number,
  itemKey: PropTypes.func,
  onItemsRendered: PropTypes.func,
  onScroll: PropTypes.func,
  overscanColumnsCount: PropTypes.number,
  overscanColumnCount: PropTypes.number,
  overscanRowsCount: PropTypes.number,
  overscanRowCount: PropTypes.number,
  overscanCount: PropTypes.number,
  rowCount: PropTypes.number,
  width: PropTypes.number
}

BasicGrid.defaultProps = {
  itemData: new Array(1000)
    .fill(0)
    .map((e, i) => e + i),
  columnCount: 1000,
  columnWidth: 100,
  height: 150,
  rowCount: 1000,
  rowHeight: 35,
  width: 300
}

export default memo(BasicGrid)
