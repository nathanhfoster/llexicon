import React, { useEffect, useState, useRef, useCallback } from "react"
import { connect as reduxConnect } from "react-redux"
import { EntryPropTypes } from "../../../redux/Entries/propTypes"
import EntryDifferences from "./EntryDifferences"
import { Container, Row, Col } from "reactstrap"
import { BasicModal, EntryCard } from "../../../components"
import {
  SetEntryRedux,
  UpdateReduxEntry,
  SyncEntries,
  ClearEntry,
} from "../../../redux/Entries/actions"
import { findDifferentProps } from "./utils"
import deepEquals from "../../../utils/deepEquals"

const mapStateToProps = ({ Entries: { item } }) => ({
  entryFromServer: item,
})

const mapDispatchToProps = {
  SetEntryRedux,
  UpdateReduxEntry,
  SyncEntries,
  ClearEntry,
}

const ResolveEntryConflictModal = ({
  entry,
  entryFromServer,
  SetEntryRedux,
  UpdateReduxEntry,
  SyncEntries,
  ClearEntry,
}) => {
  const [hasResolved, setHasResolved] = useState(false)
  const [show, setShow] = useState(false)
  const [entryToUpdate, setEntryToUpdate] = useState({})
  const { current: previousEntry } = useRef(entry)

  const toggleShow = (toggle) => {
    setShow((prevShow) => toggle || !prevShow)
  }

  useEffect(() => {
    return () => {
      ClearEntry()
    }
  }, [])

  useEffect(() => {
    const userDidNotUpdateEntryInRedux =
      previousEntry._lastUpdated === entry._lastUpdated
    const hasDifferentProps =
      findDifferentProps(entryFromServer, entry).length > 0
    if (!hasResolved && userDidNotUpdateEntryInRedux && hasDifferentProps) {
      toggleShow(true)
      setEntryToUpdate(entry)
    }
  }, [entry, entry, entryFromServer])

  const handleLocalEntryCardClick = useCallback(() => {
    setEntryToUpdate(entry)
  }, [entry])

  const handleEntryFromServerCardClick = useCallback(() => {
    setEntryToUpdate(entryFromServer)
  }, [entryFromServer])

  const handleSave = useCallback(async () => {
    setHasResolved(true)
    const updateDate = new Date()
    SetEntryRedux(entryToUpdate, updateDate)
    await UpdateReduxEntry(entryToUpdate.id, entryToUpdate, updateDate)
    await SyncEntries()
  }, [entryToUpdate])

  const localEntryCardSelected = deepEquals(entry, entryToUpdate)

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
                onClickCallback={handleLocalEntryCardClick}
                selected={localEntryCardSelected}
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
                onClickCallback={handleEntryFromServerCardClick}
                selected={entryFromServerCardSelected}
              />
            </Col>
          </Row>
        </Container>
      )}
    </BasicModal>
  )
}

ResolveEntryConflictModal.propTypes = {
  entry: EntryPropTypes,
  entryFromServer: EntryPropTypes,
}

export default reduxConnect(
  mapStateToProps,
  mapDispatchToProps
)(ResolveEntryConflictModal)
