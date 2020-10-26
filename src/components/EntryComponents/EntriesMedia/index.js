import React, { useRef, useEffect, useState, useCallback, useMemo, lazy } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import { EntriesPropTypes } from 'redux/Entries/propTypes'
import { Container, Row, Col, Media } from 'reactstrap'
import { NavLink } from 'react-router-dom'
import { GoToEntryDetail } from 'redux/router/actions'
import { filterMapArray } from 'utils'
import { useScrollable } from 'hooks'
import './styles.css'

const I_FRAME_REGEX = /(?:<iframe[^>]*)(?:(?:\/>)|(?:>.*?<\/iframe>))/
const IMAGE_REGEX = /<img.*?src="(.*?)"[^\>]+>/
const SRC_REGEX = /(?<=src=").*?(?=[\?"])/

const ENTRIES_RENDER_OFFSET = 6
const DEFAULT_VIEWABLE_ENTRIES_RANGE = [0, ENTRIES_RENDER_OFFSET * 2]

const mapStateToProps = ({
  router: {
    location: { search },
  },
}) => ({ search })

const EntriesMedia = ({ entries, search }) => {
  const containerRef = useRef()
  const [viewableEntriesRange, setViewableEntriesRange] = useState(DEFAULT_VIEWABLE_ENTRIES_RANGE)

  const [beginOffset, endOffset] = viewableEntriesRange

  const handleReachedBottom = useCallback(() => {
    setViewableEntriesRange([beginOffset, endOffset + ENTRIES_RENDER_OFFSET])
  }, [beginOffset, endOffset])

  const handleOnScroll = useScrollable({ handleReachedBottom })

  const viewableEntries = useMemo(() => entries.slice(beginOffset, endOffset), [
    entries,
    beginOffset,
    endOffset,
  ])

  const renderEntryMedia = useMemo(
    () =>
      viewableEntries.reduce((acc, { id: entryId, title, html, EntryFiles }, i) => {
        const handleEntryOnClick = () => {
          GoToEntryDetail(entryId)
        }
        if (EntryFiles?.length > 0) {
          EntryFiles.forEach(({ id, url, entry_id }, j) => {
            acc.push(
              <Col
                key={`File-${entryId}-${id}-${j}`}
                xs={6}
                md={4}
                xl={3}
                onClick={handleEntryOnClick}
              >
                <b className='Overflow'>{title}</b>
                <Media className='EntryMedia' src={url} />
              </Col>,
            )
          })
        }

        if (I_FRAME_REGEX.test(html)) {
          const [iFrame] = html.match(I_FRAME_REGEX)
          const [src] = iFrame.match(SRC_REGEX)

          acc.push(
            <Col key={`File-${entryId}-${i}`} xs={6} md={4} xl={3} onClick={handleEntryOnClick}>
              <b className='EntryMedia Overflow'>{title}</b>
              <div class='embed-responsive embed-responsive-16by9'>
                <iframe title={title} className=' embed-responsive-item' src={src} />
              </div>
            </Col>,
          )
        }

        if (IMAGE_REGEX.test(html)) {
          const [image] = html.match(IMAGE_REGEX)
          const [src] = image.match(SRC_REGEX)
          acc.push(
            <Col key={`File-${entryId}-${i}`} xs={6} md={4} xl={3} onClick={handleEntryOnClick}>
              <b className='EntryMedia Overflow'>{title}</b>
              <div class='embed-responsive embed-responsive-16by9'>
                <iframe title={title} className=' embed-responsive-item' src={src} />
              </div>
            </Col>,
          )
        }

        return acc
      }, []),
    [viewableEntries],
  )

  return (
    <Container className='EntriesMedia'>
      <div
        ref={containerRef}
        className='EntryFoldersContainer Container row'
        onScroll={handleOnScroll}
      >
        {renderEntryMedia}
      </div>
    </Container>
  )
}

EntriesMedia.propTypes = {
  entries: EntriesPropTypes,
  search: PropTypes.string.isRequired,
}

EntriesMedia.defaultProps = { search: '' }

export default reduxConnect(mapStateToProps)(EntriesMedia)
