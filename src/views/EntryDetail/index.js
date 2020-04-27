import React, { useEffect, useRef, useMemo } from "react"
import PropTypes from "prop-types"
import { EntriesPropTypes } from "../../redux/Entries/propTypes"
import { Container, Row, Col } from "reactstrap"
import { Entry } from "../../components"
import { connect as reduxConnect } from "react-redux"
import { GetUserEntryDetails, SyncEntries } from "../../redux/Entries/actions"
import { SetCalendar } from "../../redux/Calendar/actions"
import PageNotFound from "../PageNotFound"
import "./styles.css"

const mapStateToProps = ({ User, Entries: { items, filteredItems } }) => ({
  UserId: User.id,
  items,
  filteredItems,
})

const mapDispatchToProps = { GetUserEntryDetails, SyncEntries, SetCalendar }

const EntryDetail = ({
  entryId,
  UserId,
  items,
  filteredItems,
  GetUserEntryDetails,
  SyncEntries,
  SetCalendar,
}) => {
  let setCalendarDateToEntryDate = useRef(false)
  const entry = useMemo(
    () => items.concat(filteredItems).find(({ id }) => id == entryId),
    [UserId, entryId, items, filteredItems]
  )

  const readOnly = Boolean(entry && entry.author && UserId !== entry.author)

  useEffect(() => {
    SyncEntries(
      () => new Promise((resolve) => resolve(GetUserEntryDetails(entryId)))
    )
  }, [])

  useEffect(() => {
    if (
      entry &&
      entry.date_created_by_author &&
      !setCalendarDateToEntryDate.current
    ) {
      const activeDate = new Date(entry.date_created_by_author)
      SetCalendar({ activeDate })
      setCalendarDateToEntryDate.current = true
    }
  }, [entry])

  return entry ? (
    <Container className="Container">
      <Row>
        <Col xs={12} className="EntryDetail p-0">
          <Entry
            readOnly={readOnly}
            entry={entry}
            shouldRedirectOnDelete={true}
          />
        </Col>
      </Row>
    </Container>
  ) : (
    <PageNotFound
      title={"Entry Not Found. It is either deleted or no longer public."}
    />
  )
}

EntryDetail.propTypes = {
  entryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  UserId: PropTypes.number,
  items: EntriesPropTypes.isRequired,
  filteredItems: EntriesPropTypes.isRequired,
  GetUserEntryDetails: PropTypes.func.isRequired,
  SyncEntries: PropTypes.func.isRequired,
  SetCalendar: PropTypes.func.isRequired,
}

export default reduxConnect(mapStateToProps, mapDispatchToProps)(EntryDetail)
