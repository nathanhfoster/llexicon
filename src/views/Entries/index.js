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
import Moment from "react-moment"
import TextEditor from "../../components/TextEditor"
import { UpdateReduxEntry, SyncEntries } from "../../actions/Entries"
import "./styles.css"

const mapStateToProps = ({ User, Entries: { items } }) => ({
  UserId: User.id,
  entries: items
})

const mapDispatchToProps = { UpdateReduxEntry, SyncEntries }

class Entries extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {
    UserId: PropTypes.number,
    UpdateReduxEntry: PropTypes.func.isRequired,
    SyncEntries: PropTypes.func.isRequired
  }

  static defaultProps = {}

  componentWillMount() {
    this.getState(this.props)
  }

  componentDidMount() {
    const { UserId, SyncEntries } = this.props
    if (UserId) {
      SyncEntries()
    }
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const { entries } = props
    this.setState({ entries })
  }

  componentWillUnmount() {
    const { UserId, SyncEntries } = this.props
    if (UserId) {
      SyncEntries()
    }
  }

  handleDeleteEntry = id => {
    const { DeleteEntry } = this.props
    DeleteEntry(id)
  }

  renderEntries = entries => {
    const { UpdateReduxEntry } = this.props
    return entries.map((entry, i) => {
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
            key={id || i}
            style={{
              backgroundColor: "rgba(245, 245, 245, 0.8)",
              marginBottom: 16,
              padding: "16px 0",
              borderRadius: 4,
              boxShadow: "var(--primaryBoxShadow)"
            }}
          >
            <Col xs={12}>
              <InputGroup key={id || i} className="EntryInput">
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
                <InputGroupAddon addonType="append">
                  <InputGroupText color="primary">
                    <i
                      className="far fa-clock"
                      style={{ fontSize: 20, marginRight: 4 }}
                    />
                    <Moment fromNow>{date_created}</Moment>
                  </InputGroupText>
                </InputGroupAddon>
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
            <Col xs={12} style={{ marginTop: 8 }}>
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
