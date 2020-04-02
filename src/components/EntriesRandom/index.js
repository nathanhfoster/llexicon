import React, { memo } from "react"
import { EntriesPropTypes } from "../../redux/Entries/propTypes"
import { connect as reduxConnect } from "react-redux"
import { EntryCards } from "../"
import { getRandomInt } from "../../helpers"

const NUMBER_OF_RANDOM_ENTRIES = 4

const mapStateToProps = ({ Entries: { items, filteredItems } }) => ({
  items,
  filteredItems
})

const EntriesRandom = ({ items, filteredItems }) => {

  const viewableEntries = useMemo(
    () =>
      items.concat(filteredItems).filter(item => !item._shouldDelete),
    [items, filteredItems]
  )

  let randomEntries = []

  if (entries.length > 0) {
    for (let i = 0; i < NUMBER_OF_RANDOM_ENTRIES; i++) {
      const randomIndex = getRandomInt(0, viewableEntries.length - 1)
      const entry = viewableEntries[randomIndex]
      randomEntries.push(entry)
    }
  }

  return <EntryCards entries={randomEntries} />
}

EntriesRandom.propTypes = {
  items: EntriesPropTypes,
  filteredItems: EntriesPropTypes
}

const isEqual = (prevProps, nextProps) => {
  const prevEntries = prevProps.items.concat(prevProps.filteredItems)
  const nextEntries = nextProps.items.concat(nextProps.filteredItems)
  const isEqual = prevEntries.length === nextEntries.length

  return isEqual
}

export default reduxConnect(mapStateToProps)(memo(EntriesRandom, isEqual))
