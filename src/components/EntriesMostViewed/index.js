import React, { useMemo, Fragment } from "react"
import { EntriesPropTypes } from "../../redux/Entries/propTypes"
import { connect as reduxConnect } from "react-redux"
import { EntryCards, Header } from "../"

const NUMBER_OF_MOST_VIEWED_ENTRIES = 4

const mapStateToProps = ({ Entries: { items, filteredItems } }) => ({
  items,
  filteredItems,
})

const EntriesMostViewed = ({ items, filteredItems }) => {
  const entriesMostViewed = useMemo(
    () =>
      items
        .concat(filteredItems)
        .filter(({ _shouldDelete }) => !_shouldDelete)
        .sort((a, b) => b.views - a.views)
        .slice(0, NUMBER_OF_MOST_VIEWED_ENTRIES),
    [items, filteredItems]
  )

  return (
    <Fragment>
      <Header fill="var(--quinaryColor)">Most Viewed Entries</Header>
      <EntryCards entries={entriesMostViewed} />
    </Fragment>
  )
}

EntriesMostViewed.propTypes = {
  items: EntriesPropTypes,
  filteredItems: EntriesPropTypes,
}

export default reduxConnect(mapStateToProps)(EntriesMostViewed)
