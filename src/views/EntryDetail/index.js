import React, { useEffect, useRef, useMemo } from "react"
import PropTypes from "prop-types"
import { EntryPropTypes } from "../../redux/Entries/propTypes"
import { connect as reduxConnect } from "react-redux"
import { Container, Row, Col } from "reactstrap"
import { Entry } from "../../components"

import { GetUserEntryDetails, SyncEntries } from "../../redux/Entries/actions"
import { SetCalendar } from "../../redux/Calendar/actions"
import PageNotFound from "../PageNotFound"
import { BASE_JOURNAL_ENTRY_ID } from "../../redux/Entries/reducer"
import "./styles.css"

const mapStateToProps = (
  { User: { id }, Entries: { items, filteredItems } },
  { entryId }
) => ({
  userId: id,
  entry: [...items, ...filteredItems].find(({ id }) => id == entryId),
})

const mapDispatchToProps = { GetUserEntryDetails, SyncEntries, SetCalendar }

const EntryDetail = ({
  entryId,
  entry,
  userId,
  GetUserEntryDetails,
  SyncEntries,
  SetCalendar,
}) => {
  let setCalendarDateToEntryDate = useRef(false)

  const entryIsLocalOnly = entryId.toString().includes(BASE_JOURNAL_ENTRY_ID)

  const readOnly = Boolean(entry && entry.author && userId !== entry.author)

  useEffect(() => {
    if (!entryIsLocalOnly) {
      SyncEntries(
        () => new Promise((resolve) => resolve(GetUserEntryDetails(entryId)))
      )
    }
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
  entry: EntryPropTypes,
  userId: PropTypes.number,
  GetUserEntryDetails: PropTypes.func.isRequired,
  SyncEntries: PropTypes.func.isRequired,
  SetCalendar: PropTypes.func.isRequired,
}

export default reduxConnect(mapStateToProps, mapDispatchToProps)(EntryDetail)
