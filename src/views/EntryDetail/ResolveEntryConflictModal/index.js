import React, { useEffect, useRef, useState, useCallback, memo } from "react"
import { useDispatch } from "react-redux"
import { EntryPropTypes } from "../../../redux/Entries/propTypes"
import EntryDifferences from "./EntryDifferences"
import { Container, Row, Col } from "reactstrap"
import { BasicModal, EntryCard } from "../../../components"
import { UpdateReduxEntry, SyncEntries } from "../../../redux/Entries/actions"
import { getEntryDate, entryDatesAreTheSame, entriesDiffer } from "./utils"

const ResolveEntryConflictModal = ({ entry }) => {
  const dispatch = useDispatch()
  const [show, setShow] = useState(false)
  const [entryToUpdate, setEntryToUpdate] = useState({})

  const toggleShow = (toggle) => {
    setShow((prevShow) => toggle || !prevShow)
  }
  const conflictRef = useRef(false)
  const prevEntryRef = useRef(entry)

  const handleUpdateEntry = (entryToUpdate) => {
    setEntryToUpdate(entryToUpdate)
  }

  useEffect(() => {
    if (!conflictRef.current) {
      const { current: previousEntry } = prevEntryRef

      if (entriesDiffer(previousEntry, entry)) {
        conflictRef.current = true
        toggleShow(true)
        handleUpdateEntry(entry)
      }
    }
  }, [entry])

  const handlePrevEntryCardClick = useCallback(() => {
    handleUpdateEntry(prevEntryRef.current)
  }, [prevEntryRef.current])

  const handleCurrentEntryCardClick = useCallback(() => {
    handleUpdateEntry(entry)
  }, [entry])

  const handleSave = useCallback(async () => {
    await dispatch(UpdateReduxEntry(entryToUpdate.id, entryToUpdate))
    await dispatch(SyncEntries())
  }, [entryToUpdate])

  const prevEntryCardSelected = entryDatesAreTheSame(
    prevEntryRef.current,
    entryToUpdate
  )

  const currentEntryCardSelected = entryDatesAreTheSame(entry, entryToUpdate)

  return (
    <BasicModal
      size="lg"
      button={false}
      show={show}
      title={"Resolve Entry Conflict"}
      onSaveCallback={handleSave}
      toggle={toggleShow}
      disabledSave={!entryToUpdate.id}
    >
      <Container className="Container">
        <Row>
          <Col
            xs={{ size: 12, order: 1 }}
            md={{ size: 6, order: 1 }}
            className="p-2 md-p-1"
          >
            <EntryCard
              {...prevEntryRef.current}
              onClickCallback={handlePrevEntryCardClick}
              selected={prevEntryCardSelected}
            />
          </Col>
          <Col
            xs={{ size: 12, order: 2 }}
            md={{ size: 12, order: 3 }}
            className="p-2 md-p-1"
          >
            <EntryDifferences entry1={prevEntryRef.current} entry2={entry} />
          </Col>
          <Col
            xs={{ size: 12, order: 2 }}
            md={{ size: 6, order: 1 }}
            className="p-2 md-p-1"
          >
            <EntryCard
              {...entry}
              onClickCallback={handleCurrentEntryCardClick}
              selected={currentEntryCardSelected}
            />
          </Col>
        </Row>
      </Container>
    </BasicModal>
  )
}

ResolveEntryConflictModal.propTypes = {
  entry: EntryPropTypes,
}

export default memo(ResolveEntryConflictModal)
