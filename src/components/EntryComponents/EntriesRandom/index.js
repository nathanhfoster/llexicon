import React, { useRef, useMemo, Fragment } from 'react'
import { EntriesPropTypes } from 'redux/Entries/propTypes'
import { connect } from 'react-redux'
import { EntryCards, Header } from '../..'
import { Col } from 'reactstrap'
import './styles.css'

const mapStateToProps = ({ Entries: { items, filteredItems, showOnlyPublic } }) => ({
  items,
  filteredItems,
  showOnlyPublic,
})

const EntriesRandom = ({ items, filteredItems, showOnlyPublic }) => {
  const containerRef = useRef()

  const viewableEntries = useMemo(
    () =>
      items
        .concat(filteredItems)
        .filter(({ _shouldDelete, is_public }) => (showOnlyPublic ? is_public : !_shouldDelete)),
    [items, filteredItems, showOnlyPublic],
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
        <Header fill='var(--quinaryColor)'>Random Entries</Header>
      </Col>
      <div ref={containerRef} className='HomeRow pb-1 mx-1 row'>
        <EntryCards entries={randomEntries} containerRef={containerRef} />
      </div>
    </Fragment>
  )
}

EntriesRandom.propTypes = {
  items: EntriesPropTypes,
  filteredItems: EntriesPropTypes,
}

export default connect(mapStateToProps)(EntriesRandom)
