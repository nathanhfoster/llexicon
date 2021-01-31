import React, { useRef, useMemo, Fragment } from 'react'
import PropTypes from 'prop-types'
import { EntriesPropTypes } from 'redux/Entries/propTypes'
import { connect } from 'react-redux'
import { EntryCards, Header } from '../..'
import { Col } from 'reactstrap'
import { RouteMap } from 'redux/router/actions'

const mapStateToProps = ({ Entries: { items, filteredItems, showOnlyPublic } }) => ({
  entries: filteredItems.length > 0 ? items.concat(filteredItems) : items,
  showOnlyPublic,
})

export const EntriesMostViewed = ({ entries, showOnlyPublic, height, headerLink }) => {
  const containerRef = useRef()
  const styles = useMemo(() => ({ maxHeight: height }), [height])
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
        <Header fill='var(--quinaryColor)' href={headerLink ? RouteMap.ENTRIES_MOST_VIEWED : null}>
          Most Viewed Entries
        </Header>
      </Col>
      <div ref={containerRef} className='HomeRow mb-3 pb-1 mx-1 row' style={styles}>
        <EntryCards entries={entriesMostViewed} containerRef={containerRef} />
      </div>
    </Fragment>
  )
}

EntriesMostViewed.propTypes = {
  entries: EntriesPropTypes,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  headerLink: PropTypes.bool,
}

EntriesMostViewed.defaultProps = {
  height: 424,
  headerLink: false,
}

export default connect(mapStateToProps)(EntriesMostViewed)
