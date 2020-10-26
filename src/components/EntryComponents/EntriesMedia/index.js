import React, { useState, useCallback, useMemo, memo } from 'react'
import { EntriesPropTypes } from 'redux/Entries/propTypes'
import EntryMedia from './EntryMedia'
import { Container } from 'reactstrap'
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
      viewableEntries.reduce((acc, { id: entryId, title, html, tags, people, EntryFiles }, i) => {
        const defaultProps = { entryId, title, tags, people }

        if (EntryFiles?.length > 0) {
          EntryFiles.forEach(({ id, url, entry_id }, j) => {
            acc.push(<EntryMedia key={`File-${entryId}-${id}-${j}`} {...defaultProps} src={url} />)
          })
        }

        if (I_FRAME_REGEX.test(html)) {
          const [iFrame] = html.match(I_FRAME_REGEX)
          const [src] = iFrame.match(SRC_REGEX)

          acc.push(<EntryMedia key={`File-${entryId}-${i}`} {...defaultProps} isVideo src={src} />)
        }

        if (IMAGE_REGEX.test(html)) {
          const [image] = html.match(IMAGE_REGEX)
          const [src] = image.match(SRC_REGEX)
          acc.push(<EntryMedia key={`File-${entryId}-${i}`} {...defaultProps} src={src} />)
        }

        return acc
      }, []),
    [viewableEntries],
  )

  return (
    <Container>
      <div className='EntriesMediaContainer Container row' onScroll={handleOnScroll}>
        {renderEntryMedia}
      </div>
    </Container>
  )
}

EntriesMedia.propTypes = {
  entries: EntriesPropTypes,
}

export default memo(EntriesMedia)
