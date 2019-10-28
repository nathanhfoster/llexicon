import React, { PureComponent, createRef } from "react"
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
import { PostEntry } from "../../actions/Entries"
import { SetEditorState } from "../../actions/TextEditor"
import PostUpdateDelete from "../../components/PostUpdateDelete"
import "./styles.css"

const mapStateToProps = ({
  User,
  TextEditor: { clearedOn, editorStateHtml }
}) => ({ UserId: User.id, clearedOn, editorStateHtml })

const mapDispatchToProps = { PostEntry, SetEditorState }

class Home extends PureComponent {
  constructor(props) {
    super(props)

    this.titleRef = createRef()

    this.state = { title: "" }
  }

  static propTypes = {
    UserId: PropTypes.number,
    clearedOn: PropTypes.string,
    editorStateHtml: PropTypes.string,
    SetEditorState: PropTypes.func.isRequired,
    PostEntry: PropTypes.func.isRequired
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
    const { editorStateHtml, clearedOn } = props
    this.setState({ editorStateHtml, clearedOn })
  }

  handlePostEntry = () => {
    const { UserId, PostEntry } = this.props
    const { editorStateHtml, title, tags } = this.state

    const payload = {
      author: UserId,
      title,
      html: editorStateHtml,
      tags
    }

    PostEntry(payload)
  }

  handleInputChange = e => {
    const { id, value } = e.target
    this.setState(currentState => ({ [id]: value }))
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
              onChangeCallback={SetEditorState}
            />
          </Col>
        </Row>
      </Container>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Home)
