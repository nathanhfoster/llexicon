import React, { useMemo, memo } from "react"
import PropTypes from "prop-types"
import { Container, Row, Col } from "reactstrap"
import {
  LocationButtonModal,
  TagsButtonModal,
  RatingButtonModal,
  MediaButtonModal
} from "./ToolbarButtonModals"
import TagsContainer from "../../TagsContainer"
import EntryFilesCarousel from "../../EntryFilesCarousel"
import "./styles.css"

const BottomToolbar = ({ entry, editorRef, onChangeCallback, xs }) => {
  const buttons = useMemo(
    () => [
      [
        {
          Component: MediaButtonModal,
          props: { html: entry.html, onChangeCallback, editorRef }
        },
        {
          Component: TagsButtonModal,
          props: { tags: entry.tags, onChangeCallback }
        },
        {
          Component: RatingButtonModal,
          props: { rating: entry.rating, onChangeCallback }
        }
      ],
      [
        {
          Component: LocationButtonModal,
          props: { entry, onChangeCallback, xs }
        }
      ]
    ],
    [entry]
  )

  const renderButtonColumns = columns =>
    columns.map((ButtonModal, i) => {
      const { Component, props } = ButtonModal
      return <Component key={i} xs={12 / columns.length} {...props} />
    })

  const renderButtonRows = useMemo(
    () =>
      buttons.map((columns, i) => (
        <Row key={i} className="BottomToolButtonRow">
          {renderButtonColumns(columns)}
        </Row>
      )),
    [buttons]
  )

  return (
    <Container fluid className="BottomToolBar">
      <Row className="BottomToolBarTags">
        <TagsContainer tags={entry.tags} />
      </Row>
      <Row className="BottomToolBarFiles">
        <Col xs={12} className="p-1">
          <EntryFilesCarousel
            html={entry.html}
            files={entry.EntryFiles}
            onChangeCallback={onChangeCallback}
            editorRef={editorRef}
          />
        </Col>
      </Row>
      {renderButtonRows}
    </Container>
  )
}

BottomToolbar.propTypes = {
  editorRef: PropTypes.object,
  entry: PropTypes.object.isRequired,
  onChangeCallback: PropTypes.func.isRequired
}

export default memo(BottomToolbar)
