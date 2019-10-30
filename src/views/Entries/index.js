import React, { PureComponent, createRef } from "react"
import { connect as reduxConnect } from "react-redux"
import PropTypes from "prop-types"
import { Container, Row, Col } from "reactstrap"
import Entry from "../../components/Entry"
import { FixedSizeList } from "react-window"
import { UpdateReduxEntry, SyncEntries } from "../../actions/Entries"
import "./styles.css"

const mapStateToProps = ({ User, Entries: { items } }) => ({
  UserId: User.id,
  entries: items.filter(item => !item.shouldDelete)
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

  renderEntries = ({ data, index, style, isScrolling }) => {
    const entry = data[index]

    return <Entry {...entry} containerStyle={style} />
  }

  render() {
    const { entries } = this.state
    return (
      <Container className="Entries">
        {/* <Row>{this.renderEntries(entries)}</Row> */}
        <Row>
          <FixedSizeList
            ref={this.listRef}
            className="listSearchItemsContainer fade-in"
            height={880}
            width="100%"
            itemData={entries}
            itemCount={entries.length}
            itemSize={381}
          >
            {this.renderEntries}
          </FixedSizeList>
        </Row>
      </Container>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Entries)
