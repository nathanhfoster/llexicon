import React, { useMemo, useState, memo, Fragment } from "react"
import { EntriesPropTypes } from "../../redux/Entries/propTypes"
import { connect as reduxConnect } from "react-redux"
import { EntryCards, Header } from "../"
import { ButtonGroup, Button } from "reactstrap"
import { getRandomInt } from "../../helpers"
import "./styles.css"

const NUMBER_OF_RANDOM_ENTRIES = 4

const mapStateToProps = ({ Entries: { items, filteredItems } }) => ({
  items,
  filteredItems
})

const EntriesRandom = ({ items, filteredItems }) => {
  const [shouldRerender, forceUpdate] = useState(false)
  const handleRefresh = () => forceUpdate(!shouldRerender)
  const viewableEntries = useMemo(
    () => items.concat(filteredItems).filter(item => !item._shouldDelete),
    [items, filteredItems, shouldRerender]
  )

  let randomEntries = []

  if (viewableEntries.length > 0) {
    for (let i = 0; i < NUMBER_OF_RANDOM_ENTRIES; i++) {
      const randomIndex = getRandomInt(0, viewableEntries.length - 1)
      const entry = viewableEntries[randomIndex]
      randomEntries.push(entry)
    }
  }

  return (
    <Fragment>
      <Header fill="var(--quinaryColor)" display="inline-block">
        Random Entries
        <ButtonGroup className="EntriesRandomRefreshButtonContainer">
          <Button outline color="primary" onClick={handleRefresh}>
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
  filteredItems: EntriesPropTypes
}

const isEqual = (prevProps, nextProps) => {
  const prevEntries = prevProps.items.concat(prevProps.filteredItems)
  const nextEntries = nextProps.items.concat(nextProps.filteredItems)
  const isEqual = prevEntries.length === nextEntries.length

  return isEqual
}

export default reduxConnect(mapStateToProps)(memo(EntriesRandom, isEqual))
