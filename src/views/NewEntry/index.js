import React from "react"
import { connect as reduxConnect } from "react-redux"
import PropTypes from "prop-types"
import { Editor, ReactDatePicker } from "../../components"
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
import "./styles.css"

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
}

const NewEntry = ({
  entry,
  activeDate,

  SetCalendar,
  PostReduxEntry,
  SyncEntries,
  SetEditorState,
  ClearEditorState,
}) => {
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
    const payload = {
      ...entry,
      date_created: activeDate,
      date_created_by_author: activeDate,
      date_updated: activeDate,
    }

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
                className="SaveButton"
                color="primary"
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
}

export default reduxConnect(mapStateToProps, mapDispatchToProps)(NewEntry)
