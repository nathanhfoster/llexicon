import React, { useEffect, useRef } from "react"
import PropTypes from "prop-types"
import { EntryPropTypes } from "../../redux/Entries/propTypes"
import { connect as reduxConnect } from "react-redux"
import { Container, Row, Col } from "reactstrap"
import { Entry } from "../../components"
import ResolveEntryConflictModal from "./ResolveEntryConflictModal"

import {
  GetUserEntryDetails,
  ClearEntry,
  SyncEntries,
} from "../../redux/Entries/actions"
import { SetCalendar } from "../../redux/Calendar/actions"
import PageNotFound from "../PageNotFound"
import { BASE_JOURNAL_ENTRY_ID } from "../../redux/Entries/reducer"
import "./styles.css"

const mapStateToProps = ({
  User: { id },
  Entries: { item, isPending },
  Window: {
    navigator: { serviceWorker },
  },
}) => ({
  userId: id,
  entry: item,
  serviceWorkerController: serviceWorker?.controller || {},
  isPending,
})

const mapDispatchToProps = {
  GetUserEntryDetails,
  ClearEntry,
  SyncEntries,
  SetCalendar,
}

const EntryDetail = ({
  entryId,
  userId,
  entry,
  serviceWorkerController,
  isPending,
  GetUserEntryDetails,
  ClearEntry,
  SyncEntries,
  SetCalendar,
}) => {
  let setCalendarDateToEntryDate = useRef(false)

  // const entryIsLocalOnly = entryId.toString().includes(BASE_JOURNAL_ENTRY_ID)

  const entryFound = Boolean(entry)

  const entryAuthor = entry ? entry.author : null

  const readOnly = Boolean(
    (!isPending && entryAuthor && !userId) || userId !== entryAuthor
  )

  useEffect(() => {
    // if (!entryIsLocalOnly) {
      SyncEntries(
        () => new Promise((resolve) => resolve(GetUserEntryDetails(entryId)))
      )
    // }

    return () => {
      ClearEntry()
    }
  }, [])

  useEffect(() => {
    if (
      entryFound &&
      entry.date_created_by_author &&
      !setCalendarDateToEntryDate.current
    ) {
      const activeDate = new Date(entry.date_created_by_author)
      SetCalendar({ activeDate })
      setCalendarDateToEntryDate.current = true
    }
  }, [entry])

  return entryFound ? (
    <Container className="Container">
      {/* {!readOnly && <ResolveEntryConflictModal entry={entry} />} */}
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
  userId: PropTypes.number,
  entry: EntryPropTypes,
  isPending: PropTypes.bool.isRequired,
  GetUserEntryDetails: PropTypes.func.isRequired,
  ClearEntry: PropTypes.func.isRequired,
  SyncEntries: PropTypes.func.isRequired,
  SetCalendar: PropTypes.func.isRequired,
}

export default reduxConnect(mapStateToProps, mapDispatchToProps)(EntryDetail)
