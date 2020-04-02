import React, { useMemo, memo } from "react"
import { EntriesPropTypes } from "../../redux/Entries/propTypes"
import { connect as reduxConnect } from "react-redux"
import { EntryCards } from "../"
import MomentJs from "moment"

const mapStateToProps = ({ Entries: { items, filteredItems } }) => ({
  items,
  filteredItems
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

  return <EntryCards entries={entriesOnThisDay} />
}

EntriesRediscover.propTypes = {
  items: EntriesPropTypes,
  filteredItems: EntriesPropTypes
}

const isEqual = (prevProps, nextProps) => {
  const prevEntries = prevProps.items.concat(prevProps.filteredItems)
  const nextEntries = nextProps.items.concat(nextProps.filteredItems)
  const isEqual = prevEntries.length === nextEntries.length

  return isEqual
}

export default reduxConnect(mapStateToProps)(memo(EntriesRediscover, isEqual))
