import React, { useMemo, memo, Fragment } from "react"
import PropTypes from "prop-types"
import { Collapse, Container, Row, Col, Button } from "reactstrap"
import {
  LocationButtonModal,
  TagsButtonModal,
  RatingButtonModal,
  MediaButtonModal
} from "./ToolbarButtonModals"
import TagsContainer from "../../TagsContainer"
import EntryFilesCarousel from "../../EntryFilesCarousel"
import "./styles.css"

const renderButtonColumns = columns =>
  columns.map((ButtonModal, i) => {
    const { Component, props } = ButtonModal
    return <Component key={i} xs={12 / columns.length} {...props} />
  })

const BottomToolbar = ({
  readOnly,
  entry,
  editorRef,
  isOpen,
  canToggleToolbars,
  toggleBottomToolbar,
  onChangeCallback,
  xs
}) => {
  const buttons = useMemo(
    () => [
      [
        {
          Component: MediaButtonModal,
          props: { onChangeCallback, editorRef }
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
    <Fragment>
      {canToggleToolbars && (
        <Button
          color="inherit"
          className={`ToggleBottomToolbarButton Center p-1 ${
            isOpen ? "BottomToolbarIsOpen" : "BottomToolbarIsClosed"
          }`}
          onClick={toggleBottomToolbar}
        >
          <i className={`fas fa-angle-down fa-2x`} />
        </Button>
      )}
      <Collapse isOpen={isOpen}>
        <Container fluid className="BottomToolBar">
          <Row className="BottomToolBarTags">
            <Col xs={12} className="pl-1 pr-1">
              <TagsContainer tags={entry.tags} />
            </Col>
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
      </Collapse>
    </Fragment>
  )
}

BottomToolbar.propTypes = {
  readOnly: PropTypes.bool,
  editorRef: PropTypes.object,
  entry: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggleBottomToolbar: PropTypes.func.isRequired,
  onChangeCallback: PropTypes.func.isRequired
}

export default memo(BottomToolbar)
