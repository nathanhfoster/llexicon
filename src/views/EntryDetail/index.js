import React, { useEffect, useMemo } from "react"
import PropTypes from "prop-types"
import { Container, Row, Col } from "reactstrap"
import { Entry } from "../../components"
import { connect as reduxConnect } from "react-redux"
import { useParams } from "react-router-dom"
import { GetUserEntryDetails, SyncEntries } from "../../actions/Entries"
import PageNotFound from "../PageNotFound"
import "./styles.css"

const mapStateToProps = ({
  User,
  Entries: { items, filteredItems },
  Window: {
    isMobile,
    screen: { availHeight }
  }
}) => ({
  UserId: User.id,
  items,
  filteredItems,
  entryContainerHeight: availHeight - (isMobile ? 46 : 68) - 48
})

const mapDispatchToProps = { GetUserEntryDetails, SyncEntries }

const EntryDetail = ({
  items,
  filteredItems,
  entryContainerHeight,
  SyncEntries,
  GetUserEntryDetails
}) => {
  const { entryId } = useParams()
  const entry = useMemo(
    () => items.concat(filteredItems).find(entry => entry.id == entryId),
    [entryId, items, filteredItems]
  )

  useEffect(() => {
    SyncEntries(
      () => new Promise(resolve => resolve(GetUserEntryDetails(entryId)))
    )
  }, [])

  return entry ? (
    <Container className="Container">
      <Row>
        <Col xs={12} className="EntryDetail p-0">
          <Entry
            entry={entry}
            // containerHeight={entryContainerHeight}
            shouldRedirectOnDelete
            topToolbarHidden={false}
          />
        </Col>
      </Row>
    </Container>
  ) : (
    <PageNotFound title={"Entry Not Found"} />
  )
}

EntryDetail.propTypes = {
  UserId: PropTypes.number,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  filteredItems: PropTypes.arrayOf(PropTypes.object).isRequired,
  GetUserEntryDetails: PropTypes.func.isRequired,
  SyncEntries: PropTypes.func.isRequired
}

export default reduxConnect(mapStateToProps, mapDispatchToProps)(EntryDetail)
