import React, { useRef, useMemo, Fragment } from 'react'
import PropTypes from 'prop-types'
import { EntriesPropTypes } from 'redux/Entries/propTypes'
import { connect } from 'react-redux'
import { EntryCards, Header } from '../..'
import { Col } from 'reactstrap'
import './styles.css'
import { RouteMap } from 'redux/router/actions'

const mapStateToProps = ({ Entries: { items, filteredItems, showOnlyPublic } }) => ({
  entries: filteredItems.length > 0 ? items.concat(filteredItems) : items,
  showOnlyPublic,
})

export const EntriesRandom = ({ entries, showOnlyPublic, height, headerLink }) => {
  const containerRef = useRef()
  const styles = useMemo(() => ({ maxHeight: height }), [height])
  const viewableEntries = useMemo(
    () =>
      entries.filter(({ _shouldDelete, is_public }) =>
        showOnlyPublic ? is_public : !_shouldDelete,
      ),
    [entries, showOnlyPublic],
  )

  const randomEntries = useMemo(() => {
    const uniqueEntryIndices = [...viewableEntries]

    let entries = []

    for (let i = 0, { length } = uniqueEntryIndices; i < length; i++) {
      const entry = uniqueEntryIndices.popRandomValue()

      entries.push(entry)
    }

    return entries
  }, [viewableEntries])

  return (
    <Fragment>
      <Col xs={12} className='p-0'>
        <Header fill='var(--quinaryColor)' href={headerLink ? RouteMap.ENTRIES_RANDOM : null}>
          Random Entries
        </Header>
      </Col>
      <div ref={containerRef} className='HomeRow pb-1 mx-1 row' style={styles}>
        <EntryCards entries={randomEntries} containerRef={containerRef} />
      </div>
    </Fragment>
  )
}

EntriesRandom.propTypes = {
  entries: EntriesPropTypes,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  headerLink: PropTypes.bool,
}

EntriesRandom.defaultProps = {
  height: 424,
  headerLink: false,
}
export default connect(mapStateToProps)(EntriesRandom)
