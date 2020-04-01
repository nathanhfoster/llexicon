import React, { useEffect } from "react"
import { connect as reduxConnect } from "react-redux"
import PropTypes from "prop-types"
import { Editor, ReactDatePicker } from "../../components"
import {
  Container,
  Row,
  Col,
  InputGroup,
  Input,
  InputGroupAddon,
  InputGroupText
} from "reactstrap"
import { SetCalendar } from "../../redux/Calendar/Calendar"
import { PostReduxEntry, SyncEntries } from "../../redux/Entries/actions"
import {
  SetEditorState,
  ClearEditorState
} from "../../redux/TextEditor/actions"
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
  const shouldPostEntry = !!entry.title

  activeDate = new Date(activeDate)

  useEffect(() => {
    return async () => {
      if (shouldPostEntry) {
        const payload = {
          id: `NewEntry-${entriesLength}`,
          ...entry,
          date_created_by_author: activeDate,
          _shouldPost: true
        }

        await PostReduxEntry(payload)
        SyncEntries()
        ClearEditorState()
      }
    }
  }, [shouldPostEntry])

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
          <InputGroup className="EntryInput">
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
