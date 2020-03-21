import React, { createRef, PureComponent } from "react"
import PropTypes from "prop-types"
import { FixedSizeGrid as Grid } from "react-window"

class BasicGrid extends PureComponent {
  constructor(props) {
    super(props)
    this.gridContainerRef = createRef()

    this.state = { gridContainerRef: null }
  }

  static propTypes = {
    // FixedSizeGrid
    itemData: PropTypes.arrayOf(
      PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          render: PropTypes.object
        })
      )
    ),
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

  static defaultProps = {
    itemData: [
      [
        { id: 0, render: <div>Row0, Col0</div> },
        { id: 1, render: <div>Row0, Col1</div> },
        { id: 2, render: <div>Row0, Col2</div> }
      ],
      [
        { id: 3, render: <div>Row1, Col0</div> },
        { id: 4, render: <div>Row1, Col1</div> },
        { id: 5, render: <div>Row1, Col2</div> }
      ],
      [
        { id: 6, render: <div>Row2, Col0</div> },
        { id: 7, render: <div>Row2, Col1</div> },
        { id: 8, render: <div>Row2, Col2</div> }
      ]
    ],
    height: 600,
    rowHeight: 200,
    rowCount: 3,

    width: 600,
    columnWidth: 200,
    columnCount: 3
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let nextState = null
    const { gridContainerRef } = prevState
    if (gridContainerRef) {
      const {
        clientWidth,
        clientHeight,
        offsetWidth,
        offsetHeight
      } = gridContainerRef
      console.log(clientWidth, clientHeight, offsetWidth, offsetHeight)
    }

    return nextState
  }

  componentDidMount() {
    console.log(this.gridContainerRef.current.getBoundingClientRect())
    this.setState({ gridContainerRef: this.gridContainerRef.current })
  }

  renderCell = ({ data, isScrolling, rowIndex, columnIndex, style }) => {
    try {
      const { id, render } = data[rowIndex][columnIndex]

      return (
        <div key={id} style={style}>
          {render}
        </div>
      )
    } catch {
      return null
    }
  }

  render() {
    return (
      <div
        ref={this.gridContainerRef}
        style={{
          display: "block",
          minHeight: 100,
          minWidth: 100,
          width: "100%",
          height: "100%"
        }}
      >
        <Grid {...this.props}>{this.renderCell}</Grid>
      </div>
    )
  }
}

export default BasicGrid
