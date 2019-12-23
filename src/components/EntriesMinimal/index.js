import React, { Component, createRef } from "react"
import PropTypes from "prop-types"
import { Col } from "reactstrap"
import { FixedSizeList } from "react-window"
import EntryMinimal from "../EntryMinimal"
import deepEquals from "../../helpers/deepEquals"

class EntriesMinimal extends Component {
  constructor(props) {
    super(props)

    this.minimalEntriesListRef = createRef()

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
    itemSize: 92
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { entries } = nextProps
    return { entries }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const stateChanged = !deepEquals(this.state, nextState)

    return stateChanged
  }

  renderMinimalEntries = ({ data, index, style, isScrolling }) => {
    const entry = data[index]

    return (
      <Col key={entry.id} xs={12} style={{ ...style, padding: 4 }}>
        <EntryMinimal {...entry} />
      </Col>
    )
  }

  render() {
    const { onItemsRendered, height, width, itemSize } = this.props
    const { entries } = this.state

    return (
      <FixedSizeList
        ref={this.minimalEntriesListRef}
        height={height}
        width={width}
        itemData={entries}
        itemCount={entries.length}
        itemSize={itemSize}
        onItemsRendered={onItemsRendered}
      >
        {this.renderMinimalEntries}
      </FixedSizeList>
    )
  }
}
export default EntriesMinimal
