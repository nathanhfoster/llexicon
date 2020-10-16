import React, { useEffect, useState, useRef, useCallback } from "react"
import PropTypes from "prop-types"
import { EntryPropTypes } from "redux/Entries/propTypes"
import { connect as reduxConnect } from "react-redux"
import EntryDifferences from "./EntryDifferences"
import { Container, Row, Col } from "reactstrap"
import { BasicModal, EntryCard } from "components"
import {
  UpdateReduxEntry,
  SyncEntries,
  ClearEntry,
} from "redux/Entries/actions"
import { findDifferentProps } from "./utils"
import "./styles.css"

const mapStateToProps = ({ Entries: { isPending, item } }) => ({
  fetchingEntryFromServer: isPending,
  entryFromServer: item,
})

const mapDispatchToProps = {
  UpdateReduxEntry,
  SyncEntries,
  ClearEntry,
}

const ResolveEntryConflictModal = ({
  fetchingEntryFromServer,
  entryFromServer,
  entry,
  UpdateReduxEntry,
  SyncEntries,
  ClearEntry,
}) => {
  const [hasResolved, setHasResolved] = useState(false)
  const [show, setShow] = useState(false)
  const [entryToUpdate, setEntryToUpdate] = useState({})
  const [localEntryCardSelected, setLocalEntryCardSelected] = useState(true)
  const { current: previousEntry } = useRef(entry)

  const toggleShow = (toggle) => {
    setShow((prevShow) => (toggle !== null ? toggle : !prevShow))
  }

  useEffect(() => {
    return () => {
      ClearEntry()
      handleSave()
    }
  }, [])

  useEffect(() => {
    const userDidNotUpdateEntryInRedux =
      previousEntry._lastUpdated === entry._lastUpdated
    const hasDifferentProps =
      findDifferentProps(entryFromServer, entry).length > 0

    if (
      !hasResolved &&
      !fetchingEntryFromServer &&
      userDidNotUpdateEntryInRedux &&
      hasDifferentProps
    ) {
      const { views, date_updated } = entryFromServer

      toggleShow(true)
      setEntryToUpdate({
        ...entry,
        _lastUpdated: date_updated,
        date_updated,
        views,
      })
    } else {
      toggleShow(false)
      setEntryToUpdate({})
    }
  }, [hasResolved, fetchingEntryFromServer, entry, entryFromServer])

  const handleLocalEntryCardClick = useCallback(() => {
    setEntryToUpdate(entry)
    setLocalEntryCardSelected(true)
  }, [entry])

  const handleEntryFromServerCardClick = useCallback(() => {
    setEntryToUpdate(entryFromServer)
    setLocalEntryCardSelected(false)
  }, [entryFromServer])

  const handleSave = useCallback(async () => {
    setHasResolved(true)
    await UpdateReduxEntry(entryToUpdate.id, entryToUpdate)
    await SyncEntries()
  }, [entryToUpdate])

  const entryFromServerCardSelected = !localEntryCardSelected

  return (
    <BasicModal
      size="lg"
      className="p-0"
      button={false}
      show={show}
      title={"Resolve Entry Conflict"}
      onSaveCallback={handleSave}
      toggle={toggleShow}
      disabledSave={!entryToUpdate.id}
    >
      {entry && entryFromServer && (
        <Container className="Container">
          <Row>
            <Col
              xs={{ size: 12, order: 1 }}
              md={{ size: 6, order: 1 }}
              className="p-2 md-p-1"
            >
              <EntryCard
                {...entry}
                onClick={handleLocalEntryCardClick}
                selected={localEntryCardSelected}
                cardHeaderClassName="ResolveEntryConflictCardHeader"
                reduceHtml={false}
              />
            </Col>
            <Col
              xs={{ size: 12, order: 2 }}
              md={{ size: 12, order: 3 }}
              className="p-2 md-p-1"
            >
              <EntryDifferences entry1={entry} entry2={entryFromServer} />
            </Col>
            <Col
              xs={{ size: 12, order: 2 }}
              md={{ size: 6, order: 1 }}
              className="p-2 md-p-1"
            >
              <EntryCard
                {...entryFromServer}
                onClick={handleEntryFromServerCardClick}
                selected={entryFromServerCardSelected}
                cardHeaderClassName="ResolveEntryConflictCardHeader"
                reduceHtml={false}
              />
            </Col>
          </Row>
        </Container>
      )}
    </BasicModal>
  )
}

ResolveEntryConflictModal.propTypes = {
  fetchingEntryFromServer: PropTypes.bool.isRequired,
  entryFromServer: EntryPropTypes,
  entry: EntryPropTypes,
  SetEntry: PropTypes.func.isRequired,
  UpdateReduxEntry: PropTypes.func.isRequired,
  SyncEntries: PropTypes.func.isRequired,
  ClearEntry: PropTypes.func.isRequired,
}

export default reduxConnect(
  mapStateToProps,
  mapDispatchToProps
)(ResolveEntryConflictModal)
