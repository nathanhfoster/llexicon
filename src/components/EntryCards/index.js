import React, { useMemo, memo } from "react"
import { EntriesPropTypes } from "../../redux/Entries/propTypes"
import { Col } from "reactstrap"
import EntryCard from "./EntryCard"

const EntryCards = ({ className, entries }) => {
  const renderEntryCards = useMemo(
    () =>
      entries.map(entry => (
        <Col key={entry.id} xs={6} md={4} xl={3} className={className}>
          <EntryCard {...entry} />
        </Col>
      )),
    [entries]
  )

  return renderEntryCards
}

EntryCards.propTypes = { entries: EntriesPropTypes }

EntryCards.defaultProps = { className: "p-1 p-sm-2" }

export default memo(EntryCards)
