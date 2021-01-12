import React, { useRef, useMemo, useEffect, useCallback, lazy } from 'react'
import PropTypes from 'prop-types'
import { EntryPropTypes } from 'redux/Entries/propTypes'
import { connect } from 'react-redux'
import { Container, Row, Col } from 'reactstrap'
import ResolveEntryConflictModal from './ResolveEntryConflictModal'
import {
  GetUserEntryDetails,
  ClearEntry,
  SyncEntries,
  UpdateReduxEntries,
} from 'redux/Entries/actions'
import { SetCalendar } from 'redux/Calendar/actions'
import PageNotFound from '../PageNotFound'
import { isReadOnly } from 'redux/Entries/utils'
import { LoadingScreen } from 'components'

const Entry = lazy(() => import('../../components/EntryComponents/Entry'))

const mapStateToProps = (
  {
    User: { id },
    Entries: { item, items, filteredItems },
    Window: {
      navigator: { serviceWorker },
    },
  },
  { entryId },
) => ({
  userId: id,
  entry: items.concat(filteredItems).find(({ id }) => id == entryId),
  serviceWorkerController: serviceWorker?.controller || {},
  isPending: item?.isPending,
})

const mapDispatchToProps = {
  GetUserEntryDetails,
  ClearEntry,
  SyncEntries,
  SetCalendar,
  UpdateReduxEntries,
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
  UpdateReduxEntries,
}) => {
  let setCalendarDateToEntryDate = useRef(false)

  const readOnly = useMemo(() => isReadOnly(entry.id, entry.author, userId), [
    entry.id,
    entry.author,
    userId,
  ])

  useEffect(() => {
    GetUserEntryDetails(entryId)

    return () => {
      ClearEntry()
    }
  }, [ClearEntry, GetUserEntryDetails, entryId])

  useEffect(() => {
    if (entry?.date_created_by_author && !setCalendarDateToEntryDate.current) {
      const activeDate = new Date(entry.date_created_by_author) || new Date()
      SetCalendar({ activeDate })
      setCalendarDateToEntryDate.current = true
    }
  }, [SetCalendar, entry])

  const handleOnChange = useCallback(
    payload => {
      if (readOnly || !entry) return
      UpdateReduxEntries(payload)
    },
    [UpdateReduxEntries, entry, readOnly],
  )

  const handleOnSubmit = useCallback(() => {
    SyncEntries()
  }, [SyncEntries])

  return entry?.id ? (
    <Container className='Container'>
      {/* {!readOnly && <ResolveEntryConflictModal entry={entry} />} */}
      <Row>
        <Col xs={12} className='p-0'>
          <Entry
            showOptionsMenu
            readOnly={readOnly}
            entry={entry}
            shouldRedirectOnDelete={true}
            onChange={handleOnChange}
            onSubmit={handleOnSubmit}
          />
        </Col>
      </Row>
    </Container>
  ) : isPending ? (
    <LoadingScreen />
  ) : (
    <PageNotFound />
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

export default connect(mapStateToProps, mapDispatchToProps)(EntryDetail)
