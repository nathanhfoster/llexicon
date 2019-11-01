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
    innerHeight,
    screen: { availHeight }
  }
}) => ({
  UserId: User.id,
  entries: items.filter(item => !item.shouldDelete),
  innerHeight,
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
    const { entries, viewPort, innerHeight } = props

    const inputButtonHeight = 46

    const listHeight = viewPort

    this.setState({ entries, listHeight, innerHeight })
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
      <Col key={newId} style={{ ...style,  }} xs={12}>
        <Entry id={newId} {...restOfProps} containerHeight={style.height} />
      </Col>
    )
  }

  render() {
    const { entries, listHeight } = this.state

    return (
      <Container className="Entries">
        <Row>
          <FixedSizeList
            ref={this.listRef}
            height={listHeight}
            width="100%"
            itemData={entries}
            itemCount={entries.length}
            itemSize={listHeight / 2}
          >
            {this.renderEntries}
          </FixedSizeList>
        </Row>
      </Container>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Entries)
