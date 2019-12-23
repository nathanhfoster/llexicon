import React, { Component, createRef } from "react"
import PropTypes from "prop-types"
import { Col } from "reactstrap"
import { FixedSizeList } from "react-window"
import Entry from "../../components/Entry"
import deepEquals from "../../helpers/deepEquals"

class EntriesDetailed extends Component {
  constructor(props) {
    super(props)

    this.detailedEntriesListRef = createRef()

    this.state = {}
  }

  static propTypes = {
    entries: PropTypes.arrayOf(PropTypes.object.isRequired),
    onItemsRendered: PropTypes.func,
    height: PropTypes.number.isRequired,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }

  static defaultProps = {
    height: 500,
    width: "100%",
    itemSize: 60
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { entries } = nextProps
    return { entries }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const stateChanged = !deepEquals(this.state, nextState)

    return stateChanged
  }

  renderDetailedEntries = ({ data, index, style, isScrolling }) => {
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

  render() {
    const { onItemsRendered, height, width, itemSize } = this.props
    const { entries } = this.state

    return (
      <FixedSizeList
        ref={this.detailedEntriesListRef}
        height={height}
        width={width}
        itemData={entries}
        itemCount={entries.length}
        itemSize={itemSize}
        onItemsRendered={onItemsRendered}
      >
        {this.renderDetailedEntries}
      </FixedSizeList>
    )
  }
}
export default EntriesDetailed
