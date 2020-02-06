import React from "react"
import { connect as reduxConnect } from "react-redux"
import PropTypes from "prop-types"
import Editor from "../../components/Editor"
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  Button
} from "reactstrap"
import ReactDatePicker from "../../components/ReactDatePicker"
import { SetCalendar } from "../../actions/Calendar"
import { PostReduxEntry, SyncEntries } from "../../actions/Entries"
import { SetEditorState, ClearEditorState } from "../../actions/TextEditor"
import { DEFAULT_STATE_TEXT_EDITOR } from "../../store/Reducers/TextEditor"
import "./styles.css"

const mapStateToProps = ({
  Calendar: { activeDate },
  TextEditor,
  Entries: { items }
}) => ({
  entry: TextEditor,
  activeDate,
  entriesLength: items.length
})

const mapDispatchToProps = {
  SetCalendar,
  PostReduxEntry,
  SyncEntries,
  SetEditorState,
  ClearEditorState
}

const NewEntry = ({
  entry,
  activeDate,
  entriesLength,
  SetCalendar,
  PostReduxEntry,
  SyncEntries,
  SetEditorState,
  ClearEditorState
}) => {
  const editorStateHtmlIsBlank = entry.html === DEFAULT_STATE_TEXT_EDITOR.html

  const postDisabled = editorStateHtmlIsBlank && !entry.title

  const handlePostEntry = async () => {
    const {
      html,
      title,
      tags,
      rating,
      address,
      latitude,
      longitude,
      EntryFiles
    } = entry

    const payload = {
      id: `NewEntry-${entriesLength}`,
      title,
      html,
      tags,
      rating,
      address,
      latitude,
      longitude,
      date_created_by_author: activeDate,
      EntryFiles,
      _shouldPost: true
    }

    await PostReduxEntry(payload)
    SyncEntries()
    ClearEditorState()
  }

  const handleInputChange = ({ target: { id, value } }) =>
    SetEditorState({ [id]: value })

  const handleTextEditorChange = ({ ...payload }) =>
    SetEditorState({ ...payload })

  const handleChangeDateCreatedByAuthor = activeDate =>
    SetCalendar({ activeDate })

  return (
    <Container className="NewEntry Container">
      <Row>
        <Col xs={12} className="p-0">
          <InputGroup
            tag={Form}
            className="EntryInput"
            onSubmit={handlePostEntry}
            method="post"
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
                color="primary"
                style={{ color: "white" }}
                disabled={postDisabled}
                type="submit"
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
  entry: PropTypes.object.isRequired,
  SetCalendar: PropTypes.func.isRequired,
  SetEditorState: PropTypes.func.isRequired,
  ClearEditorState: PropTypes.func.isRequired,
  PostReduxEntry: PropTypes.func.isRequired,
  SyncEntries: PropTypes.func.isRequired,
  entriesLength: PropTypes.number.isRequired
}

export default reduxConnect(mapStateToProps, mapDispatchToProps)(NewEntry)
