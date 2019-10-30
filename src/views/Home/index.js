import React, { PureComponent } from "react"
import { connect as reduxConnect } from "react-redux"
import PropTypes from "prop-types"
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
import TextEditor from "../../components/TextEditor"
import { PostReduxEntry } from "../../actions/Entries"
import { SetEditorState, clearEditorState } from "../../actions/TextEditor"
import "./styles.css"

const mapStateToProps = ({
  User,
  TextEditor: { clearedOn, title, editorStateHtml }
}) => ({ UserId: User.id, clearedOn, title, editorStateHtml })

const mapDispatchToProps = { PostReduxEntry, SetEditorState, clearEditorState }

class Home extends PureComponent {
  constructor(props) {
    super(props)

    this.state = { title: "" }
  }

  static propTypes = {
    UserId: PropTypes.number,
    clearedOn: PropTypes.string,
    editorStateHtml: PropTypes.string,
    SetEditorState: PropTypes.func.isRequired,
    clearEditorState: PropTypes.func.isRequired,
    PostReduxEntry: PropTypes.func.isRequired
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
    const { clearedOn, title, editorStateHtml } = props
    this.setState({ clearedOn, title, editorStateHtml })
  }

  handlePostEntry = () => {
    const { UserId, PostReduxEntry, clearEditorState } = this.props
    const { editorStateHtml, title, tags } = this.state

    const payload = {
      author: UserId,
      title,
      html: editorStateHtml,
      tags,
      shouldPost: true
    }

    PostReduxEntry(payload)
    clearEditorState()
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

  render() {
    const { SetEditorState } = this.props
    const { editorStateHtml, clearedOn, title } = this.state
    return (
      <Container className="Home">
        <Row>
          <Col xs={12}>
            <InputGroup style={{ marginBottom: 8 }}>
              <Input
                type="text"
                name="title"
                id="title"
                placeholder="Title..."
                value={title}
                onChange={this.handleInputChange}
              />
              <InputGroupAddon
                addonType="append"
                onClick={this.handlePostEntry}
              >
                <InputGroupText
                  tag={Button}
                  color="primary"
                  style={{ color: "white" }}
                >
                  Post
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Col>
          <Col xs={12}>
            <TextEditor
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
