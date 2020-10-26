import React, { useRef, useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import { EntryPropTypes } from 'redux/Entries/propTypes'
import { connect as reduxConnect } from 'react-redux'
import { Container, Row, Col } from 'reactstrap'
import { Entry } from '../../components'
import ResolveEntryConflictModal from './ResolveEntryConflictModal'
import { GetUserEntryDetails, ClearEntry, SyncEntries } from 'redux/Entries/actions'
import { SetCalendar } from 'redux/Calendar/actions'
import PageNotFound from '../PageNotFound'
import { BASE_JOURNAL_ENTRY_ID } from 'redux/Entries/utils'
import './styles.css'

const mapStateToProps = (
  {
    User: { id },
    Entries: { items, filteredItems, isPending },
    Window: {
      navigator: { serviceWorker },
    },
  },
  { entryId },
) => ({
  userId: id,
  entry: items.concat(filteredItems).find(({ id }) => id == entryId),
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

  const entryIsLocalOnly = useMemo(() => entryId.toString().includes(BASE_JOURNAL_ENTRY_ID), [
    entryId,
  ])

  const entryAuthor = entry ? entry.author : null

  const readOnly = Boolean(
    !entryIsLocalOnly ||
      (!isPending && entryAuthor && !userId) ||
      (entryAuthor && userId !== entryAuthor),
  )

  useEffect(() => {
    // if (!entryIsLocalOnly) {
    SyncEntries(() => new Promise(resolve => resolve(GetUserEntryDetails(entryId))))
    // }

    return () => {
      ClearEntry()
    }
  }, [ClearEntry, GetUserEntryDetails, SyncEntries, entryId])

  useEffect(() => {
    if (entry && entry.date_created_by_author && !setCalendarDateToEntryDate.current) {
      const activeDate = new Date(entry.date_created_by_author)
      SetCalendar({ activeDate })
      setCalendarDateToEntryDate.current = true
    }
  }, [SetCalendar, entry])

  return entry ? (
    <Container className='Container'>
      {/* {!readOnly && <ResolveEntryConflictModal entry={entry} />} */}
      <Row>
        <Col xs={12} className='EntryDetail p-0'>
          <Entry readOnly={readOnly} entry={entry} shouldRedirectOnDelete={true} />
        </Col>
      </Row>
    </Container>
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

export default reduxConnect(mapStateToProps, mapDispatchToProps)(EntryDetail)
