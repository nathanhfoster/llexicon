import React, { useMemo, useState, Fragment } from 'react'
import { EntriesPropTypes } from 'redux/Entries/propTypes'
import { connect as reduxConnect } from 'react-redux'
import { EntryCards, Header } from '../..'
import { ButtonGroup, Button } from 'reactstrap'
import './styles.css'

const NUMBER_OF_MOST_VIEWED_ENTRIES = 8

const mapStateToProps = ({ Entries: { items, filteredItems, showOnlyPublic } }) => ({
  items,
  filteredItems,
  showOnlyPublic,
})

const EntriesRandom = ({ items, filteredItems, showOnlyPublic }) => {
  const [shouldRerender, forceUpdate] = useState(false)
  const handleRefresh = () => forceUpdate(!shouldRerender)
  const viewableEntries = useMemo(
    () =>
      items
        .concat(filteredItems)
        .filter(({ _shouldDelete, is_public }) => (showOnlyPublic ? is_public : !_shouldDelete))
        .slice(0, NUMBER_OF_MOST_VIEWED_ENTRIES),
    [items, filteredItems, shouldRerender, showOnlyPublic],
  )

  const randomEntries = useMemo(() => {
    const uniqueEntryIndices = [...viewableEntries]
    const numberOfRandomEntries =
      uniqueEntryIndices.length > NUMBER_OF_MOST_VIEWED_ENTRIES
        ? NUMBER_OF_MOST_VIEWED_ENTRIES
        : uniqueEntryIndices.length

    let entries = []

    for (let i = 0; i < numberOfRandomEntries; i++) {
      const entry = uniqueEntryIndices.popRandomValue()

      entries.push(entry)
    }

    return entries
  }, [viewableEntries])

  return (
    <Fragment>
      <Header fill='var(--quinaryColor)' display='inline-block'>
        Random Entries
        <ButtonGroup className='EntriesRandomRefreshButtonContainer'>
          <Button color='accent' onClick={handleRefresh}>
            <i className='fas fa-sync-alt' />
          </Button>
        </ButtonGroup>
      </Header>
      <EntryCards entries={randomEntries} />
    </Fragment>
  )
}

EntriesRandom.propTypes = {
  items: EntriesPropTypes,
  filteredItems: EntriesPropTypes,
}

export default connect(mapStateToProps)(EntriesRandom)
