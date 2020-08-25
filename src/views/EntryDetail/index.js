import React, { useEffect, useRef } from "react"
import PropTypes from "prop-types"
import { EntryPropTypes } from "reducers//Entries/propTypes"
import { connect } from "store/provider"
import { Container, Row, Col } from "reactstrap"
import { Entry } from "../../components"
import ResolveEntryConflictModal from "./ResolveEntryConflictModal"

import { GetUserEntryDetails, SyncEntries } from "reducers//Entries/actions"
import { SetCalendar } from "reducers//Calendar/actions"
import PageNotFound from "../PageNotFound"
import { BASE_JOURNAL_ENTRY_ID } from "reducers//Entries/reducer"
import "./styles.css"

const mapStateToProps = (
  {
    User: { id },
    Entries: { items, filteredItems, isPending },
    Window: {
      navigator: { serviceWorker },
    },
  },
  { entryId }
) => ({
  userId: id,
  entry: items.concat(filteredItems).find(({ id }) => id == entryId),
  serviceWorkerController: serviceWorker?.controller || {},
  isPending,
})

const mapDispatchToProps = { GetUserEntryDetails, SyncEntries, SetCalendar }

const EntryDetail = ({
  entryId,
  userId,
  entry,
  serviceWorkerController,
  isPending,
  GetUserEntryDetails,
  SyncEntries,
  SetCalendar,
}) => {
  let setCalendarDateToEntryDate = useRef(false)

  const entryIsLocalOnly = entryId.toString().includes(BASE_JOURNAL_ENTRY_ID)

  const entryFound = Boolean(entry)

  const entryAuthor = entry ? entry.author : null

  const readOnly = Boolean(
    (!isPending && entryAuthor && !userId) || userId !== entryAuthor
  )

  useEffect(() => {
    if (!entryIsLocalOnly) {
      SyncEntries(
        () => new Promise((resolve) => resolve(GetUserEntryDetails(entryId)))
      )
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
  SyncEntries: PropTypes.func.isRequired,
  SetCalendar: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(EntryDetail)
