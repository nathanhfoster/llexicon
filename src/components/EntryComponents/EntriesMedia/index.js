import React, { useState, useCallback, useMemo, memo } from 'react'
import { EntriesPropTypes } from 'redux/Entries/propTypes'
import { Container, Col, Media } from 'reactstrap'
import { GoToEntryDetail } from 'redux/router/actions'
import { useScrollable } from 'hooks'
import './styles.css'

const I_FRAME_REGEX = /(?:<iframe[^>]*)(?:(?:\/>)|(?:>.*?<\/iframe>))/
const IMAGE_REGEX = /<img.*?src="(.*?)"[^\>]+>/
const SRC_REGEX = /(?<=src=").*?(?=[\?"])/

const ENTRIES_RENDER_OFFSET = 6
const DEFAULT_VIEWABLE_ENTRIES_RANGE = [0, ENTRIES_RENDER_OFFSET * 2]

const EntriesMedia = ({ entries }) => {
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
    <Container className='EntriesMediaContainer'>
      <div
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
}

export default memo(EntriesMedia)
