import React, { useEffect, lazy } from "react"
import { connect } from "store/provider"
import PropTypes from "prop-types"
import { EntryPropTypes } from "../../redux/Entries/propTypes"
import { ReactDatePicker } from "../../components"
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  Button,
} from "reactstrap"
import { SetCalendar } from "../../redux/Calendar/actions"
import { PostReduxEntry, SyncEntries } from "../../redux/Entries/actions"

import {
  SetEditorState,
  ClearEditorState,
} from "../../redux/TextEditor/actions"

import { DEFAULT_STATE_TEXT_EDITOR } from "../../redux/TextEditor/reducer"
import { getStringBytes } from "../../utils"
import "./styles.css"
import { ResetMap } from "../../redux/Map/actions"

const Editor = lazy(() => import("../../components/Editor"))

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
  }, [])

  const editorStateHtmlIsBlank = entry.html === DEFAULT_STATE_TEXT_EDITOR.html

  const postDisabled = editorStateHtmlIsBlank && !entry.title

  activeDate = new Date(activeDate)

  const handleInputChange = ({ target: { id, value } }) =>
    SetEditorState({ [id]: value })

  const handleTextEditorChange = ({ ...payload }) =>
    SetEditorState({ ...payload })

  const handleChangeDateCreatedByAuthor = (activeDate) =>
    SetCalendar({ activeDate })

  const handlePostEntry = async () => {
    const newEntryData = {
      ...entry,
      date_created: activeDate,
      date_created_by_author: activeDate,
      date_updated: activeDate,
    }

    const size = getStringBytes(newEntryData)

    const payload = { ...newEntryData, size }

    await PostReduxEntry(payload)
    SyncEntries()
    ClearEditorState()
  }

  return (
    <Container className="NewEntry Container">
      <Row>
        <Col xs={12} className="p-0">
          <InputGroup
            tag={Form}
            className="EntryInput EntryInputTitle"
            // onSubmit={handlePostEntry}
            // method="post"
          >
            <Input
              type="text"
              name="title"
              id="title"
              placeholder="Entry title..."
              value={entry.title}
              onChange={handleInputChange}
            />
            <InputGroupAddon addonType="append">
              <InputGroupText color="primary" className="p-0">
                <ReactDatePicker
                  selected={activeDate}
                  onChange={handleChangeDateCreatedByAuthor}
                />
              </InputGroupText>
            </InputGroupAddon>
            <InputGroupAddon addonType="append" onClick={handlePostEntry}>
              <InputGroupText
                tag={Button}
                className="SaveButton"
                color="accent"
                disabled={postDisabled}
                // type="submit"
              >
                <i className="fas fa-save" style={{ fontSize: 20 }} />
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </Col>
      </Row>
      <Row className="EditorContainer">
        <Col xs={12} className="p-0">
          <Editor entry={entry} onChangeCallback={handleTextEditorChange} />
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
