import React, { useMemo, useState, Fragment } from "react"
import { EntriesPropTypes } from "../../../redux/Entries/propTypes"
import { connect } from "store/provider"
import { EntryCards, Header } from "../.."
import { ButtonGroup, Button } from "reactstrap"
import "./styles.css"

const mapStateToProps = ({
  Entries: { items, filteredItems, showOnlyPublic },
}) => ({
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
        .filter(({ _shouldDelete, is_public }) =>
          showOnlyPublic ? is_public : !_shouldDelete
        ),
    [items, filteredItems, shouldRerender, showOnlyPublic]
  )

  let randomEntries = []

  const numberOfRandomEntries =
    viewableEntries.length < 4 ? viewableEntries.length : 6

  let uniqueEntryIndices = [...viewableEntries]

  for (let i = 0; i < numberOfRandomEntries; i++) {
    const entry = uniqueEntryIndices.popRandomValue()

    randomEntries.push(entry)
  }

  return (
    <Fragment>
      <Header fill="var(--quinaryColor)" display="inline-block">
        Random Entries
        <ButtonGroup className="EntriesRandomRefreshButtonContainer">
          <Button color="accent" onClick={handleRefresh}>
            <i className="fas fa-sync-alt" />
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
