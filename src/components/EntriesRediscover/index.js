import React, { useMemo, Fragment } from "react"
import { EntriesPropTypes } from "../../redux/Entries/propTypes"
import { connect as reduxConnect } from "react-redux"
import { EntryCards, Header } from "../"
import Moment from "react-moment"
import MomentJs from "moment"

const mapStateToProps = ({ Entries: { items, filteredItems } }) => ({
  items,
  filteredItems,
})

const EntriesRediscover = ({ items, filteredItems }) => {
  const today = MomentJs()
  const entriesOnThisDay = useMemo(
    () =>
      items
        .concat(filteredItems)
        .filter(({ date_created_by_author, _shouldDelete }) => {
          if (_shouldDelete) return true
          const entryDate = MomentJs(date_created_by_author)
          const isOnThisDay = entryDate.dayOfYear() === today.dayOfYear()
          return isOnThisDay
        })
        .sort((a, b) => {
          const aDate = new Date(a._lastUpdated || a.date_updated)
          const bDate = new Date(b._lastUpdated || b.date_updated)
          return bDate - aDate
        }),
    [items, filteredItems]
  )

  return (
    <Fragment>
      <Header fill="var(--quinaryColor)">Rediscover This Day</Header>
      <Header fontSize="1.5rem">
        <Moment format="MMMM D">{today}</Moment>
      </Header>
      <EntryCards entries={entriesOnThisDay} />
    </Fragment>
  )
}

EntriesRediscover.propTypes = {
  items: EntriesPropTypes,
  filteredItems: EntriesPropTypes,
}

export default reduxConnect(mapStateToProps)(EntriesRediscover)
