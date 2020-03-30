import React from "react"
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
  const entries = items.concat(filteredItems)
  const entriesOnThisDay = entries.filter(({ date_created_by_author }) => {
    const entryDate = MomentJs(date_created_by_author)
    const isOnThisDay = entryDate.dayOfYear() === today.dayOfYear()
    return isOnThisDay
  })

  return <EntryCards entries={entriesOnThisDay} />
}

EntriesRediscover.propTypes = {
  items: EntriesPropTypes,
  filteredItems: EntriesPropTypes
}

export default reduxConnect(mapStateToProps)(EntriesRediscover)
