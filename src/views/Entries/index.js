import React, { PureComponent, createRef } from "react"
import { connect as reduxConnect } from "react-redux"
import PropTypes from "prop-types"
import { Container, Row, Col } from "reactstrap"
import Entry from "../../components/Entry"
import { FixedSizeList } from "react-window"
import { UpdateReduxEntry, SyncEntries } from "../../actions/Entries"
import "./styles.css"

const mapStateToProps = ({
  User,
  Entries: { items },
  Window: {
    screen: { availHeight }
  }
}) => ({
  UserId: User.id,
  entries: items.filter(item => !item.shouldDelete),
  viewPort: availHeight
})

const mapDispatchToProps = { UpdateReduxEntry, SyncEntries }

class Entries extends PureComponent {
  constructor(props) {
    super(props)

    this.listRef = createRef()

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
    const { entries, viewPort } = props

    this.setState({ entries, viewPort })
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

  renderEntries = ({ data, index, style, isScrolling }) => {
    const entry = data[index]

    return (
      <div style={{ ...style, padding: 2 }}>
        <Entry {...entry} />
      </div>
    )
  }

  render() {
    const { entries, viewPort } = this.state

    return (
      <Container className="Entries">
        <Col xs={12} style={{marginTop: 8}}>
          <FixedSizeList
            ref={this.listRef}
            height={viewPort}
            width="100%"
            itemData={entries}
            itemCount={entries.length}
            itemSize={viewPort / 2}
          >
            {this.renderEntries}
          </FixedSizeList>
        </Col>
      </Container>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Entries)
