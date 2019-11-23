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
import { PostReduxEntry } from "../../actions/Entries"
import { SetEditorState, ClearEditorState } from "../../actions/TextEditor"
import { DEFAULT_STATE_TEXT_EDITOR } from "../../store/Reducers/TextEditor"
import "./styles.css"

const mapStateToProps = ({
  Calendar: { activeDate },
  TextEditor: { clearedOn, title, editorStateHtml },
  Window: {
    innerHeight,
    screen: { availHeight }
  },
  Entries: { items }
}) => ({
  activeDate,
  clearedOn,
  title,
  editorStateHtml,
  innerHeight,
  viewPortHeight: availHeight,
  entriesLength: items.length
})

const mapDispatchToProps = {
  SetCalendar,
  PostReduxEntry,
  SetEditorState,
  ClearEditorState
}

class Home extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {
    clearedOn: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date)
    ]),
    editorStateHtml: PropTypes.string,
    SetCalendar: PropTypes.func.isRequired,
    SetEditorState: PropTypes.func.isRequired,
    ClearEditorState: PropTypes.func.isRequired,
    PostReduxEntry: PropTypes.func.isRequired,
    entriesLength: PropTypes.number.isRequired
  }

  static defaultProps = {}

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      activeDate,
      clearedOn,
      title,
      editorStateHtml,
      innerHeight,
      viewPortHeight,
      footerHeight
    } = nextProps

    const editorStateHtmlIsBlank =
      editorStateHtml === DEFAULT_STATE_TEXT_EDITOR.editorStateHtml

    const postDisabled = editorStateHtmlIsBlank && !title

    return {
      activeDate,
      clearedOn,
      title,
      editorStateHtml,
      postDisabled
    }
  }

  componentDidMount() {}

  handlePostEntry = () => {
    const { PostReduxEntry, ClearEditorState, entriesLength } = this.props
    const { editorStateHtml, title, tags, activeDate } = this.state

    const payload = {
      id: `shouldPost-${entriesLength}`,
      title,
      html: editorStateHtml,
      tags,
      date_created_by_author: activeDate,
      EntryFiles: [],
      shouldPost: true
    }

    PostReduxEntry(payload)
    ClearEditorState()
  }

  handleInputChange = e => {
    const { SetEditorState } = this.props
    const { id, value } = e.target
    SetEditorState({ [id]: value })
  }

  handleTextEditorChange = editorStateHtml => {
    const { SetEditorState } = this.props
    SetEditorState({ editorStateHtml })
  }

  handleChangeDateCreatedByAuthor = activeDate =>
    this.props.SetCalendar({ activeDate })

  render() {
    const {
      editorStateHtml,
      clearedOn,
      title,
      editorHeight,
      activeDate,
      postDisabled
    } = this.state

    return (
      <Container className="Home Container">
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
                placeholder="Entry title..."
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
                  <i
                    className="fas fa-cloud-upload-alt"
                    style={{ fontSize: 20 }}
                  />
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Col>
        </Row>
        <Row className="EditorContainer">
          <Col xs={12} className="p-0">
            <Editor
              html={editorStateHtml}
              onChangeCallback={html => this.handleTextEditorChange(html)}
            />
          </Col>
        </Row>
      </Container>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Home)
