import React, { useMemo, Fragment } from 'react'
import { EntriesPropTypes } from 'redux/Entries/propTypes'
import { connect as reduxConnect } from 'react-redux'
import { EntryCards, Header } from '../..'
import Moment from 'react-moment'

const NUMBER_OF_MOST_VIEWED_ENTRIES = 8

const mapStateToProps = ({ Entries: { items, filteredItems, showOnlyPublic } }) => ({
  items,
  filteredItems,
  showOnlyPublic,
})

const EntriesRediscover = ({ items, filteredItems, showOnlyPublic }) => {
  const today = new Date()
  const entriesOnThisDay = useMemo(
    () =>
      items
        .concat(filteredItems)
        .filter(({ date_created_by_author, _shouldDelete, is_public }) => {
          if (_shouldDelete || is_public !== showOnlyPublic) return false
          const entryDate = new Date(date_created_by_author)
          const isOnThisDay =
            entryDate.getMonth() === today.getMonth() && entryDate.getDate() === today.getDate()
          return isOnThisDay
        })
        .sort((a, b) => {
          const aDate = new Date(a.date_created_by_author)
          const bDate = new Date(b.date_created_by_author)
          return bDate - aDate
        })
        .slice(0, NUMBER_OF_MOST_VIEWED_ENTRIES),
    [items, filteredItems, showOnlyPublic],
  )

  return (
    <Fragment>
      <Header fill='var(--quinaryColor)'>Rediscover This Day</Header>
      <Header fontSize='1.5rem'>
        <Moment format='MMMM D'>{today}</Moment>
      </Header>
      <EntryCards entries={entriesOnThisDay} />
    </Fragment>
  )
}

EntriesRediscover.propTypes = {
  items: EntriesPropTypes,
  filteredItems: EntriesPropTypes,
}

export default connect(mapStateToProps)(EntriesRediscover)
