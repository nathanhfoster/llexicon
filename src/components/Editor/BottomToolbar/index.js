import React, { memo, lazy, useContext } from 'react'
import PropTypes from 'prop-types'
import { EntryPropTypes } from 'redux/Entries/propTypes'
import { Collapse, Container, Row, Col, Button } from 'reactstrap'
import { TagsContainer } from '../../'
import EntryFilesCarousel from '../../EntryComponents/EntryFilesCarousel'
import { useSwipeable } from 'react-swipeable'
import { EditorConsumer } from '../'
import './styles.css'

const LocationButtonModal = lazy(() => import('./ToolbarButtonModals/LocationButtonModal'))
const TagsButtonModal = lazy(() => import('./ToolbarButtonModals/TagsButtonModal'))
const RatingButtonModal = lazy(() => import('./ToolbarButtonModals/RatingButtonModal'))
const MediaButtonModal = lazy(() => import('./ToolbarButtonModals/MediaButtonModal'))
const PeopleButtonModal = lazy(() => import('./ToolbarButtonModals/PeopleButtonModal'))

const BottomToolbar = ({ entry, isOpen, canToggleToolbars }) => {
  const { toggleBottomToolbar, handleEditorChange } = useContext(EditorConsumer)

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
          <Row className='BottomToolBarTags px-1'>
            <Col xs={5} className='BottomToolBarTagContainer p-0'>
              <TagsContainer tags={entry.tags} />
            </Col>
            <Col
              tag={Button}
              xs={2}
              color='inherit'
              className={`ToggleBottomToolbarButton Center p-0 ${
                isOpen ? 'BottomToolbarIsOpen' : 'BottomToolbarIsClosed'
              }`}
              onClick={toggleBottomToolbar}
            >
              <i className={`fas fa-angle-down fa-2x`} />
            </Col>
            <Col xs={5} className='p-0'>
              <TagsContainer tags={entry.people} faIcon='fas fa-user' emptyString='No people...' />
            </Col>
          </Row>
        </Container>
      )}
      <Collapse isOpen={isOpen}>
        <Container fluid className='BottomToolBar'>
          <Row className='BottomToolBarFiles'>
            <Col xs={12} className='p-1'>
              <EntryFilesCarousel files={entry.EntryFiles} onChange={handleEditorChange} />
            </Col>
          </Row>
          <Row className='BottomToolButtonRow'>
            <MediaButtonModal xs={6} />
            <RatingButtonModal xs={6} rating={entry.rating} onChange={handleEditorChange} />
          </Row>
          <Row className='BottomToolButtonRow'>
            <TagsButtonModal
              xs={4}
              entryId={entry.id}
              tags={entry.tags}
              html={entry.html}
              title={entry.title}
              onChange={handleEditorChange}
            />
            <PeopleButtonModal
              xs={4}
              entryId={entry.id}
              people={entry.people}
              html={entry.html}
              title={entry.title}
              onChange={handleEditorChange}
            />
            <LocationButtonModal xs={4} entry={entry} onChange={handleEditorChange} />
          </Row>
        </Container>
      </Collapse>
    </div>
  )
}

BottomToolbar.propTypes = {
  entry: EntryPropTypes.isRequired,
  isOpen: PropTypes.bool.isRequired,
}

export default memo(BottomToolbar)
