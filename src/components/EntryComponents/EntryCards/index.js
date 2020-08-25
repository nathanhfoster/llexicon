import React, { useMemo, memo } from "react"
import PropTypes from "prop-types"
import { EntriesPropTypes } from "store/reducers/Entries/propTypes"
import { Col } from "reactstrap"
import EntryCard from "./EntryCard"

const EntryCards = ({ className, entries, minimal }) => {
  const renderEntryCards = useMemo(
    () =>
      entries.map((entry) => (
        <Col key={entry.id} xs={6} md={4} xl={3} className={className}>
          <EntryCard {...entry} minimal={minimal} />
        </Col>
      )),
    [entries]
  )

  return renderEntryCards
}

EntryCards.propTypes = {
  className: PropTypes.string.isRequired,
  entries: EntriesPropTypes,
  minimal: PropTypes.bool.isRequired,
}

EntryCards.defaultProps = { className: "fade-in p-1 p-sm-2", minimal: false }

export default memo(EntryCards)
