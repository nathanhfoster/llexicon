import React, { PureComponent } from "react"
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
import "react-datepicker/dist/react-datepicker.css"
import { SetCalendar } from "../../actions/Calendar"
import { PostReduxEntry, SyncEntries } from "../../actions/Entries"
import { SetEditorState, ClearEditorState } from "../../actions/TextEditor"
import { DEFAULT_STATE_TEXT_EDITOR } from "../../store/Reducers/TextEditor"
import "./styles.css"

const mapStateToProps = ({
  Calendar: { activeDate },
  TextEditor: {
    clearedOn,
    title,
    html,
    EntryFiles,
    latitude,
    longitude,
    tags,
    rating
  },
  Window: {
    innerHeight,
    screen: { availHeight }
  },
  Entries: { items }
}) => ({
  activeDate,
  clearedOn,
  title,
  html,
  EntryFiles,
  latitude,
  longitude,
  tags,
  rating,
  innerHeight,
  viewPortHeight: availHeight,
  entriesLength: items.length
})

const mapDispatchToProps = {
  SetCalendar,
  PostReduxEntry,
  SyncEntries,
  SetEditorState,
  ClearEditorState
}

class NewEntry extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {
    clearedOn: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date)
    ]),
    html: PropTypes.string,
    SetCalendar: PropTypes.func.isRequired,
    SetEditorState: PropTypes.func.isRequired,
    ClearEditorState: PropTypes.func.isRequired,
    PostReduxEntry: PropTypes.func.isRequired,
    SyncEntries: PropTypes.func.isRequired,
    entriesLength: PropTypes.number.isRequired
  }

  static defaultProps = {}

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      activeDate,
      clearedOn,
      title,
      html,
      EntryFiles,
      latitude,
      longitude,
      tags,
      rating,
      innerHeight,
      viewPortHeight,
      footerHeight
    } = nextProps

    const editorStateHtmlIsBlank = html === DEFAULT_STATE_TEXT_EDITOR.html

    const postDisabled = editorStateHtmlIsBlank && !title

    return {
      activeDate,
      clearedOn,
      title,
      html,
      EntryFiles,
      latitude,
      longitude,
      tags,
      rating,
      postDisabled
    }
  }

  componentDidMount() {}

  handlePostEntry = async () => {
    const {
      PostReduxEntry,
      SyncEntries,
      ClearEditorState,
      entriesLength
    } = this.props
    const {
      html,
      title,
      tags,
      rating,
      latitude,
      longitude,
      activeDate
    } = this.state

    const payload = {
      id: `shouldPost-${entriesLength}`,
      title,
      html: html,
      tags,
      rating,
      latitude,
      longitude,
      date_created_by_author: activeDate,
      EntryFiles: [],
      shouldPost: true
    }

    await PostReduxEntry(payload)
    SyncEntries()
    ClearEditorState()
  }

  handleInputChange = e => {
    const { SetEditorState } = this.props
    const { id, value } = e.target
    SetEditorState({ [id]: value })
  }

  handleTextEditorChange = payload => {
    const { SetEditorState } = this.props
    SetEditorState({ ...payload })
  }

  handleChangeDateCreatedByAuthor = activeDate =>
    this.props.SetCalendar({ activeDate })

  render() {
    const {
      html,
      EntryFiles,
      latitude,
      longitude,
      tags,
      rating,
      clearedOn,
      title,
      editorHeight,
      activeDate,
      postDisabled
    } = this.state

    return (
      <Container className="NewEntry Container">
        <Row>
          <Col xs={12} className="p-0">
            <InputGroup
              tag={Form}
              className="EntryInput"
              onSubmit={this.handlePostEntry}
              method="post"
            >
              <Input
                type="text"
                name="title"
                id="title"
                placeholder="Dear Diary..."
                value={title}
                onChange={this.handleInputChange}
              />
              <InputGroupAddon addonType="append">
                <InputGroupText color="primary" className="p-0">
                  <ReactDatePicker
                    selected={activeDate}
                    onChange={this.handleChangeDateCreatedByAuthor}
                  />
                </InputGroupText>
              </InputGroupAddon>
              <InputGroupAddon
                addonType="append"
                onClick={this.handlePostEntry}
              >
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
            <Editor
              html={html}
              latitude={latitude}
              longitude={longitude}
              tags={tags}
              rating={rating}
              onChangeCallback={({ ...payload }) =>
                this.handleTextEditorChange(payload)
              }
            />
          </Col>
        </Row>
      </Container>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(NewEntry)
