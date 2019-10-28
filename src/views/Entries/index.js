import React, { PureComponent } from "react"
import { connect as reduxConnect } from "react-redux"
import PropTypes from "prop-types"
import {
  Container,
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input
} from "reactstrap"
import TextEditor from "../../components/TextEditor"
import {
  GetUserEntries,
  UpdateReduxEntry,
  UpdateEntries,
  DeleteEntry
} from "../../actions/Entries"
import BasicForm from "../../components/BasicForm"
import "./styles.css"

const mapStateToProps = ({
  User,
  TextEditor: { clearedOn, editorStateHtml },
  Entries: { items }
}) => ({ UserId: User.id, clearedOn, editorStateHtml, entries: items })

const mapDispatchToProps = { GetUserEntries, UpdateReduxEntry, UpdateEntries }

class Entries extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {
    UserId: PropTypes.number,
    clearedOn: PropTypes.string,
    editorStateHtml: PropTypes.string,
    GetUserEntries: PropTypes.func.isRequired,
    UpdateReduxEntry: PropTypes.func.isRequired,
    UpdateEntries: PropTypes.func.isRequired
  }

  static defaultProps = {}

  componentWillMount() {
    this.getState(this.props)
  }

  componentDidMount() {
    const { UserId, GetUserEntries, UpdateEntries } = this.props
    if (UserId) {
      GetUserEntries()
      UpdateEntries()
    }
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const { entries, editorStateHtml, clearedOn } = props
    this.setState({ entries, editorStateHtml, clearedOn })
  }

  componentWillUnmount() {
    const { UserId, UpdateEntries } = this.props
    if (UserId) {
      UpdateEntries()
    }
  }

  handleDeleteEntry = id => {
    const { DeleteEntry } = this.props
    DeleteEntry(id)
  }

  renderEntries = entries => {
    const { UpdateReduxEntry } = this.props
    return entries.map(entry => {
      const {
        id,
        author,
        title,
        html,
        date_created,
        date_updated,
        views,
        lastUpdated,
        shouldDelete
      } = entry
      return (
        !shouldDelete && (
          <div
            style={{
              backgroundColor: "whitesmoke",
              marginBottom: 16,
              padding: "16px 0",
              borderRadius: 4,
              boxShadow: "var(--primaryBoxShadow)"
            }}
          >
            <Col xs={12}>
              <InputGroup style={{ marginBottom: 8 }}>
                <Input
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Title..."
                  value={title}
                  onChange={e =>
                    UpdateReduxEntry({ id, title: e.target.value })
                  }
                />
                <InputGroupAddon
                  addonType="append"
                  onClick={() => UpdateReduxEntry({ id, shouldDelete: true })}
                >
                  <InputGroupText color="primary">
                    <i className="fas fa-times" style={{ fontSize: 20 }} />
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </Col>
            <Col xs={12}>
              <TextEditor
                html={html}
                onChangeCallback={html => UpdateReduxEntry({ id, html })}
              />
            </Col>
          </div>
        )
      )
    })
  }

  render() {
    const { entries } = this.state
    return (
      <Container className="Entries">
        <Row>{this.renderEntries(entries)}</Row>
      </Container>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Entries)
