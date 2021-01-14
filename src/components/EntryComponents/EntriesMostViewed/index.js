import React, { useRef, useMemo, Fragment } from 'react'
import { EntriesPropTypes } from 'redux/Entries/propTypes'
import { connect } from 'react-redux'
import { EntryCards, Header } from '../..'
import { Col } from 'reactstrap'

const mapStateToProps = ({ Entries: { items, filteredItems, showOnlyPublic } }) => ({
  entries: filteredItems.length > 0 ? items.concat(filteredItems) : items,
  showOnlyPublic,
})

const EntriesMostViewed = ({ entries, showOnlyPublic }) => {
  const containerRef = useRef()
  const entriesMostViewed = useMemo(
    () =>
      entries
        .filter(({ _shouldDelete, is_public }) => (showOnlyPublic ? is_public : !_shouldDelete))
        .sort((a, b) => b.views - a.views),
    [entries, showOnlyPublic],
  )

  return (
    <Fragment>
      <Col xs={12} className='p-0'>
        <Header fill='var(--quinaryColor)'>Most Viewed Entries</Header>
      </Col>
      <div ref={containerRef} className='HomeRow mb-3 pb-1 mx-1 row'>
        <EntryCards entries={entriesMostViewed} containerRef={containerRef} />
      </div>
    </Fragment>
  )
}

EntriesMostViewed.propTypes = {
  entries: EntriesPropTypes,
}

export default connect(mapStateToProps)(EntriesMostViewed)
