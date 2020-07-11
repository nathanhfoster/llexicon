import React, { memo } from "react"
import { EntryPropTypes } from "../../../../redux/Entries/propTypes"
import { Container, Row, Col } from "reactstrap"
import { CloudDownload } from "../../../../images/SVG"
import propsThatDiffer from "../../../../utils/propsThatDiffer"
import { MEMOIZE_ENTRY_PROPS } from "../utils"
import {
  getEntryPropSortOrder,
  getEntryPropIcon,
  renderEntryProp,
} from "./utils"
import "./styles.css"

const EntryDifferences = ({ entry1, entry2 }) => {
  const differntProps = propsThatDiffer(
    entry1,
    entry2,
    MEMOIZE_ENTRY_PROPS
  ).sort((a, b) => getEntryPropSortOrder(a) > getEntryPropSortOrder(b))

  const renderDifferentProps = differntProps.map(([prop, prev, next]) => {
    const propIcon = getEntryPropIcon(prop)
    const prevString = renderEntryProp(prop, prev)
    const nextString = renderEntryProp(prop, next)
    return (
      <Row>
        <Col xs={2} title={prop}>
          {propIcon}
        </Col>
        <Col xs={5} title={prevString}>
          {prevString}
        </Col>
        <Col xs={5} title={nextString}>
          {nextString}
        </Col>
      </Row>
    )
  })

  return (
    <Container className="EntryDifferences ShowScrollBar">
      <Row tag="h1" className="Center mb-2">
        Differences
      </Row>
      <Row>
        <Col xs={2}>Prop</Col>
        <Col xs={5}>
          <i className="fas fa-hdd mr-1" />
          Local
        </Col>
        <Col xs={5}>
          <CloudDownload className="mr-1" height={18} />
          Cloud
        </Col>
      </Row>
      {renderDifferentProps}
    </Container>
  )
}

EntryDifferences.propTypes = {
  entry1: EntryPropTypes,
  entry2: EntryPropTypes,
}

export default memo(EntryDifferences)
