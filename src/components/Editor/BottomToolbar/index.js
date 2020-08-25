import React, { useMemo, memo, lazy } from "react"
import PropTypes from "prop-types"
import { EntryPropTypes } from "store/reducers/Entries/propTypes"
import { Collapse, Container, Row, Col, Button } from "reactstrap"
import { TagsContainer } from "../../"
import EntryFilesCarousel from "../../EntryComponents/EntryFilesCarousel"
import { useSwipeable } from "react-swipeable"
import "./styles.css"

const LocationButtonModal = lazy(() =>
  import("./ToolbarButtonModals/LocationButtonModal")
)
const TagsButtonModal = lazy(() =>
  import("./ToolbarButtonModals/TagsButtonModal")
)
const RatingButtonModal = lazy(() =>
  import("./ToolbarButtonModals/RatingButtonModal")
)
const MediaButtonModal = lazy(() =>
  import("./ToolbarButtonModals/MediaButtonModal")
)
const PeopleButtonModal = lazy(() =>
  import("./ToolbarButtonModals/PeopleButtonModal")
)

const renderButtonColumns = (columns) =>
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
  xs,
}) => {
  // editorRef.current.focus()
  const editorSelection =
    editorRef && editorRef.current
      ? editorRef.current.getEditorSelection()
      : null
  const buttons = useMemo(
    () => [
      [
        {
          Component: MediaButtonModal,
          props: { editorRef, editorSelection },
        },
        {
          Component: RatingButtonModal,
          props: { rating: entry.rating, onChangeCallback, xs },
        },
      ],
      [
        {
          Component: TagsButtonModal,
          props: {
            entryId: entry.id,
            tags: entry.tags,
            html: entry.html,
            title: entry.title,
            onChangeCallback,
            xs,
          },
        },
        {
          Component: PeopleButtonModal,
          props: {
            entryId: entry.id,
            people: entry.people,
            html: entry.html,
            title: entry.title,
            onChangeCallback,
            xs,
          },
        },
        {
          Component: LocationButtonModal,
          props: { entry, onChangeCallback, xs },
        },
      ],
    ],
    [entry, editorRef, editorSelection]
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

  const handlers = useSwipeable({
    onSwipedUp: () => toggleBottomToolbar(true),
    onSwipedDown: () => toggleBottomToolbar(false),
    preventDefaultTouchmoveEvent: true,
    trackTouch: true,
    trackMouse: true,
    delta: 40,
  })

  return (
    <div {...handlers}>
      {canToggleToolbars && (
        <Container fluid>
          <Row className="BottomToolBarTags px-1">
            <Col xs={5} className="BottomToolBarTagContainer p-0">
              <TagsContainer tags={entry.tags} />
            </Col>
            <Col
              tag={Button}
              xs={2}
              color="inherit"
              className={`ToggleBottomToolbarButton Center p-0 ${
                isOpen ? "BottomToolbarIsOpen" : "BottomToolbarIsClosed"
              }`}
              onClick={toggleBottomToolbar}
            >
              <i className={`fas fa-angle-down fa-2x`} />
            </Col>
            <Col xs={5} className="p-0">
              <TagsContainer
                tags={entry.people}
                faIcon="fas fa-user"
                emptyString="No people..."
              />
            </Col>
          </Row>
        </Container>
      )}
      <Collapse isOpen={isOpen}>
        <Container fluid className="BottomToolBar">
          <Row className="BottomToolBarFiles">
            <Col xs={12} className="p-1">
              <EntryFilesCarousel
                html={entry.html}
                files={entry.EntryFiles}
                onChangeCallback={onChangeCallback}
                editorRef={editorRef}
                editorSelection={editorSelection}
              />
            </Col>
          </Row>
          {renderButtonRows}
        </Container>
      </Collapse>
    </div>
  )
}

BottomToolbar.propTypes = {
  readOnly: PropTypes.bool,
  editorRef: PropTypes.object,
  entry: EntryPropTypes.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggleBottomToolbar: PropTypes.func.isRequired,
  onChangeCallback: PropTypes.func.isRequired,
}

export default memo(BottomToolbar)
