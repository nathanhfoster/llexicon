import React, { PureComponent, createRef } from "react"
import { connect as reduxConnect } from "react-redux"
import PropTypes from "prop-types"
import { Container, Row, Col } from "reactstrap"
import Entry from "../../components/Entry"
import Home from "../Home"
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
  viewPortHeight: availHeight
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
    const { entries, viewPortHeight } = props

    const inputHeight = 46

    const listHeight = viewPortHeight - inputHeight

    let listItemHeight = 500

    if (listHeight / 2 > listItemHeight) listItemHeight = listHeight / 2

    this.setState({ entries, listHeight, listItemHeight })
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

    const { id, ...restOfProps } = entry
    const newId = id || index

    return (
      <Col key={newId} style={{ ...style /* background: "red" */ }} xs={12}>
        <Entry id={newId} {...restOfProps} containerHeight={style.height} />
      </Col>
    )
  }

  render() {
    const { entries, listHeight, listItemHeight } = this.state

    return entries.length > 0 ? (
      <Container className="Entries">
        <Row>
          <FixedSizeList
            ref={this.listRef}
            height={listHeight}
            width="100%"
            itemData={entries}
            itemCount={entries.length}
            itemSize={listItemHeight}
          >
            {this.renderEntries}
          </FixedSizeList>
        </Row>
      </Container>
    ) : (
      <Home />
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Entries)
