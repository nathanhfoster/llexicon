import React, { useMemo, Fragment } from "react"
import { EntriesPropTypes } from "store/reducers/Entries/propTypes"
import { connect } from "store/provider"
import { EntryCards, Header } from "../.."

const NUMBER_OF_MOST_VIEWED_ENTRIES = 6

const mapStateToProps = ({
  Entries: { items, filteredItems, showOnlyPublic },
}) => ({
  items,
  filteredItems,
  showOnlyPublic,
})

const EntriesMostViewed = ({ items, filteredItems, showOnlyPublic }) => {
  const entriesMostViewed = useMemo(
    () =>
      items
        .concat(filteredItems)
        .filter(({ _shouldDelete, is_public }) =>
          showOnlyPublic ? is_public : !_shouldDelete
        )
        .sort((a, b) => b.views - a.views)
        .slice(0, NUMBER_OF_MOST_VIEWED_ENTRIES),
    [items, filteredItems, showOnlyPublic]
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

export default connect(mapStateToProps)(EntriesMostViewed)
