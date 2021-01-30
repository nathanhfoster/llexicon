import React, { useEffect, useState, useMemo, memo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { EntriesPropTypes } from 'redux/Entries/propTypes'
import { Header } from 'components'
import { Col } from 'reactstrap'
import EntryCard from './EntryCard'
import { useScrollable } from 'hooks'
const ENTRIES_RENDER_OFFSET = 6
const DEFAULT_VIEWABLE_ENTRIES_RANGE = [0, ENTRIES_RENDER_OFFSET * 2]

export const EntryCards = ({ className, entries, minimal, containerRef }) => {
  const [viewableEntriesRange, setViewableEntriesRange] = useState(DEFAULT_VIEWABLE_ENTRIES_RANGE)

  const [beginOffset, endOffset] = viewableEntriesRange

  const handleReachedBottom = useCallback(() => {
    setViewableEntriesRange([beginOffset, endOffset + ENTRIES_RENDER_OFFSET])
  }, [beginOffset, endOffset])

  const handleOnScroll = useScrollable({ handleReachedBottom })

  useEffect(() => {
    if (containerRef?.current) {
      containerRef.current.addEventListener('scroll', handleOnScroll)
    }
  }, [containerRef, handleOnScroll])

  const renderEntryCards = useMemo(
    () =>
      entries.map(entry => (
        <Col key={entry.id} xs={6} md={4} xl={3} className={className}>
          <EntryCard {...entry} minimal={minimal} />
        </Col>
      )),
    [className, minimal, entries],
  )

  const renderViewableEntryCards = useMemo(() => renderEntryCards.slice(beginOffset, endOffset), [
    renderEntryCards,
    beginOffset,
    endOffset,
  ])

  return renderViewableEntryCards.length > 0 ? (
    renderViewableEntryCards
  ) : (
    <Header>No Entries</Header>
  )
}

EntryCards.propTypes = {
  className: PropTypes.string.isRequired,
  entries: EntriesPropTypes,
  minimal: PropTypes.bool.isRequired,
}

EntryCards.defaultProps = { className: 'fade-in p-1 p-sm-2', minimal: false }

export default memo(EntryCards)
