import React, { useRef, useMemo, Fragment } from 'react'
import { EntriesPropTypes } from 'redux/Entries/propTypes'
import { connect as reduxConnect } from 'react-redux'
import { EntryCards, Header } from '../..'

const mapStateToProps = ({ Entries: { items, filteredItems, showOnlyPublic } }) => ({
  items,
  filteredItems,
  showOnlyPublic,
})

const EntriesMostViewed = ({ items, filteredItems, showOnlyPublic }) => {
  const containerRef = useRef()
  const entriesMostViewed = useMemo(
    () =>
      items
        .concat(filteredItems)
        .filter(({ _shouldDelete, is_public }) => (showOnlyPublic ? is_public : !_shouldDelete))
        .sort((a, b) => b.views - a.views),
    [items, filteredItems, showOnlyPublic],
  )

  return (
    <Fragment>
      <Header fill='var(--quinaryColor)'>Most Viewed Entries</Header>
      <div ref={containerRef} className='HomeRow mb-3 pb-1 row'>
        <EntryCards entries={entriesMostViewed} containerRef={containerRef} />
      </div>
    </Fragment>
  )
}

EntriesMostViewed.propTypes = {
  items: EntriesPropTypes,
  filteredItems: EntriesPropTypes,
}

export default reduxConnect(mapStateToProps)(EntriesMostViewed)
