import React, { PureComponent } from "react"
import { connect as reduxConnect } from "react-redux"
import PropTypes from "prop-types"
import TextEditor from "../../components/TextEditor"
import {
  Container,
  Row,
  Col,
  InputGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  Button
} from "reactstrap"
import ReactDatePicker from "../../components/ReactDatePicker"
import "react-datepicker/dist/react-datepicker.css"
import { PostReduxEntry } from "../../actions/Entries"
import { SetEditorState, ClearEditorState } from "../../actions/TextEditor"
import "./styles.css"

const mapStateToProps = ({
  TextEditor: { clearedOn, title, editorStateHtml },
  Window: {
    innerHeight,
    screen: { availHeight }
  },
  Entries: { items }
}) => ({
  clearedOn,
  title,
  editorStateHtml,
  innerHeight,
  viewPortHeight: availHeight,
  entriesLength: items.length
})

const mapDispatchToProps = { PostReduxEntry, SetEditorState, ClearEditorState }

class Home extends PureComponent {
  constructor(props) {
    super(props)

    this.state = { date_created_by_author: new Date() }
  }

  static propTypes = {
    clearedOn: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date)
    ]),
    editorStateHtml: PropTypes.string,
    SetEditorState: PropTypes.func.isRequired,
    ClearEditorState: PropTypes.func.isRequired,
    PostReduxEntry: PropTypes.func.isRequired,
    entriesLength: PropTypes.number.isRequired
  }

  static defaultProps = {}

  componentWillMount() {
    this.getState(this.props)
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const {
      clearedOn,
      title,
      editorStateHtml,
      innerHeight,
      viewPortHeight,
      footerHeight
    } = props

    this.setState({
      clearedOn,
      title,
      editorStateHtml
    })
  }

  handlePostEntry = () => {
    const { PostReduxEntry, ClearEditorState, entriesLength } = this.props
    const { editorStateHtml, title, tags, date_created_by_author } = this.state

    const payload = {
      id: `shouldPost-${entriesLength}`,
      title,
      html: editorStateHtml,
      tags,
      date_created_by_author,
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

  handleChangeDateCreatedByAuthor = date_created_by_author =>
    this.setState({ date_created_by_author })

  render() {
    const {
      editorStateHtml,
      clearedOn,
      title,
      editorHeight,
      date_created_by_author
    } = this.state

    return (
      <Container className="Home Container">
        <Row>
          <Col xs={12}>
            <InputGroup className="EntryInput">
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
                    selected={date_created_by_author}
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
                >
                  <i className="fas fa-feather-alt" style={{ fontSize: 20 }} />
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Col>
        </Row>
        <Row className="EditorContainer">
          <Col xs={12}>
            <TextEditor
              shouldAutoFocus
              clearKey={clearedOn}
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
