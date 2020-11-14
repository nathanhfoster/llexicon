import React, { useEffect, useMemo, lazy, useCallback } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { EntryPropTypes } from 'redux/Entries/propTypes'
import { Container, Row, Col } from 'reactstrap'
import { SetCalendar } from 'redux/Calendar/actions'
import { PostReduxEntry, SyncEntries } from 'redux/Entries/actions'
import { SetEditorState, ClearEditorState } from 'redux/TextEditor/actions'
import { ResetMap } from 'redux/Map/actions'
import { NEW_ENTRY_ID } from 'redux/Entries/utils'

const Entry = lazy(() => import('../../components/EntryComponents/Entry'))

const mapStateToProps = ({ Calendar: { activeDate }, TextEditor }) => ({
  entry: TextEditor,
  activeDate,
})

const mapDispatchToProps = {
  SetCalendar,
  PostReduxEntry,
  SyncEntries,
  SetEditorState,
  ClearEditorState,
  ResetMap,
}

const NewEntry = ({
  entry,
  activeDate,
  SetCalendar,
  PostReduxEntry,
  SyncEntries,
  SetEditorState,
  ClearEditorState,
  ResetMap,
}) => {
  useEffect(() => {
    ResetMap()
  }, [ResetMap])

  activeDate = new Date(activeDate)

  const handleOnChange = useCallback(payload => {
    const { date_created_by_author } = payload
    if (date_created_by_author) {
      SetCalendar({ activeDate: new Date(date_created_by_author) })
    }

    SetEditorState(payload)
  }, [])

  const handleOnSubmit = useCallback(async () => {
    const payload = {
      ...entry,
      date_created_by_author: activeDate,
    }

    await new Promise(resolve => resolve(PostReduxEntry(payload))).then(payload => {
      SyncEntries()
      ClearEditorState()
    })
  }, [activeDate, entry])

  const entryToPass = useMemo(
    () => ({ ...entry, id: NEW_ENTRY_ID, date_created_by_author: activeDate }),
    [activeDate, entry],
  )

  return (
    <Container className='NewEntry Container'>
      <Row>
        <Col xs={12} className='p-0'>
          <Entry
            readOnly={false}
            entry={entryToPass}
            shouldRedirectOnDelete={true}
            onChange={handleOnChange}
            onSubmit={handleOnSubmit}
          />
        </Col>
      </Row>
    </Container>
  )
}

NewEntry.propTypes = {
  entry: EntryPropTypes.isRequired,
  SetCalendar: PropTypes.func.isRequired,
  SetEditorState: PropTypes.func.isRequired,
  ClearEditorState: PropTypes.func.isRequired,
  PostReduxEntry: PropTypes.func.isRequired,
  SyncEntries: PropTypes.func.isRequired,
  ResetMap: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(NewEntry)
