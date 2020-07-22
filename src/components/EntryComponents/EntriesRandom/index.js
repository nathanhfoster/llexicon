import React, { useMemo, useState, Fragment } from "react"
import { EntriesPropTypes } from "../../../redux/Entries/propTypes"
import { connect as reduxConnect } from "react-redux"
import { EntryCards, Header } from "../.."
import { ButtonGroup, Button } from "reactstrap"
import { getRandomInt } from "../../../utils"
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
    const randomIndex = getRandomInt(0, uniqueEntryIndices.length - 1)
    const [entry] = uniqueEntryIndices.splice(randomIndex, 1)

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

export default reduxConnect(mapStateToProps)(EntriesRandom)
