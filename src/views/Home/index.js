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
import { SetEditorState, ClearEditorState } from "../../actions/TextEditor"
import "./styles.css"

const mapStateToProps = ({
  User: { id },
  TextEditor: { clearedOn, title, editorStateHtml },
  Window: {
    innerHeight,
    navbarHeight,
    footerHeight,
    screen: { availHeight }
  }
}) => ({
  UserId: id,
  clearedOn,
  title,
  editorStateHtml,
  innerHeight,
  navbarHeight,
  footerHeight,
  viewPort: availHeight
})

const mapDispatchToProps = { PostReduxEntry, SetEditorState, ClearEditorState }

class Home extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {
    UserId: PropTypes.number,
    clearedOn: PropTypes.string,
    editorStateHtml: PropTypes.string,
    SetEditorState: PropTypes.func.isRequired,
    ClearEditorState: PropTypes.func.isRequired,
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
    const {
      clearedOn,
      title,
      editorStateHtml,
      innerHeight,
      viewPort,
      navbarHeight,
      footerHeight
    } = props

    this.setState({
      clearedOn,
      title,
      editorStateHtml,
      innerHeight,
      navbarHeight,
      footerHeight,
      viewPort
    })
  }

  handlePostEntry = () => {
    const { UserId, PostReduxEntry, ClearEditorState } = this.props
    const { editorStateHtml, title, tags } = this.state

    const payload = {
      author: UserId,
      title,
      html: editorStateHtml,
      tags,
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

  render() {
    const {
      editorStateHtml,
      clearedOn,
      title,
      innerHeight,
      navbarHeight,
      footerHeight,
      viewPort
    } = this.state

    return (
      <Container className="Home">
        <Col xs={12}>
          <InputGroup className="EntryInput">
            <Input
              type="text"
              name="title"
              id="title"
              placeholder="Title..."
              value={title}
              onChange={this.handleInputChange}
            />
            <InputGroupAddon addonType="append" onClick={this.handlePostEntry}>
              <InputGroupText
                tag={Button}
                color="primary"
                style={{ color: "white" }}
              >
                <i className="fas fa-feather-alt" style={{ fontSize: 20 }}></i>
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </Col>

        <Col
          xs={12}
          style={{
            height: `calc(${innerHeight}px - 8px - ${navbarHeight} - var(--inputButtonHeight))`
          }}
        >
          <TextEditor
            //height={`calc(100% - var(--inputButtonHeight))`}
            clearKey={clearedOn}
            html={editorStateHtml}
            onChangeCallback={html => this.handleTextEditorChange(html)}
          />
        </Col>
      </Container>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Home)
