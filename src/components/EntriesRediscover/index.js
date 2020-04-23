import React, { useMemo, Fragment } from "react"
import { EntriesPropTypes } from "../../redux/Entries/propTypes"
import { connect as reduxConnect } from "react-redux"
import { EntryCards, Header } from "../"
import Moment from "react-moment"

const mapStateToProps = ({ Entries: { items, filteredItems } }) => ({
  items,
  filteredItems,
})

const EntriesRediscover = ({ items, filteredItems }) => {
  const today = new Date()
  const entriesOnThisDay = useMemo(
    () =>
      items
        .concat(filteredItems)
        .filter(({ date_created_by_author, _shouldDelete }) => {
          if (_shouldDelete) return false
          const entryDate = new Date(date_created_by_author)
          const isOnThisDay =
            entryDate.getMonth() === today.getMonth() &&
            entryDate.getDate() === today.getDate()
          return isOnThisDay
        })
        .sort((a, b) => {
          const aDate = new Date(a.date_created_by_author)
          const bDate = new Date(b.date_created_by_author)
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
