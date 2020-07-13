import React, { memo } from "react"
import { EntryPropTypes } from "../../../../redux/Entries/propTypes"
import { BasicTable } from "../../../../components"
import { Container, Row, Col } from "reactstrap"
import { CloudDownload } from "../../../../images/SVG"
import { differenceBetweenStrings } from "../../../../utils"
import { findDifferentProps } from "../utils"
import {
  getEntryPropSortOrder,
  getEntryPropIcon,
  renderEntryProp,
} from "./utils"
import "./styles.css"

const EntryDifferences = ({ entry1, entry2 }) => {
  const differntProps = findDifferentProps(entry1, entry2).sort(
    (a, b) => getEntryPropSortOrder(a[0]) > getEntryPropSortOrder(b[0])
  )

  var tableColumns = []

  const renderDifferentProps = differntProps.map(([prop, prev, next]) => {
    const propIcon = getEntryPropIcon(prop)
    const prevString = renderEntryProp(prop, prev)
    const nextString = renderEntryProp(prop, next)
    const difference = differenceBetweenStrings(prevString, nextString)

    // tableColumns.push(
    //   {
    //     title: propIcon,
    //     key: prop,
    //     width: 40,
    //     render: (entry) => prevString,
    //   },
    //   {
    //     title: propIcon,
    //     key: prop,
    //     width: 40,
    //     render: (entry) => nextString,
    //   }
    // )

    // console.log(tableColumns)

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
      {/* <Row style={{ border: "1px solid var(--secondaryColor)" }}>
        <BasicTable
          sortable
          filterable
          columns={tableColumns}
          data={differntProps}
        />
      </Row> */}

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
