import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { Container, Row, Col } from "reactstrap"
import Entry from "../../components/Entry"
import { connect as reduxConnect } from "react-redux"
import { withRouter } from "react-router-dom"
import { GetUserEntry, SyncEntries } from "../../actions/Entries"
import { RouterPush, RouterLinkPush } from "../../ReactRouter/Routes"
import "./styles.css"

const mapStateToProps = (
  {
    User,
    Entries: { items },
    Window: {
      isMobile,
      screen: { availHeight }
    }
  },
  {
    match: {
      params: { entryId }
    }
  }
) => ({
  UserId: User.id,
  entry: items
    .filter(item => !item.shouldDelete)
    .find(entry => entry.id == entryId),
  entryId,
  entryContainerHeight: availHeight - (isMobile ? 46 : 68) - 48
})

const mapDispatchToProps = { GetUserEntry, SyncEntries }

class EntryDetail extends PureComponent {
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

  componentWillUpdate(nextProps, nextState) {}

  componentDidMount() {
    const { entryId, GetUserEntry } = this.props
    GetUserEntry(entryId, 1)
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const { entry, entryContainerHeight } = props
    this.setState({ entry, entryContainerHeight })
  }

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {
    const { UserId, SyncEntries } = this.props

    if (UserId) {
      SyncEntries()
    }
  }

  render() {
    const { entry, entryContainerHeight } = this.state
    return (
      <Container className="EntryDetail Container">
        <Row>
          <Col xs={12}>
            <Entry {...entry} containerHeight={entryContainerHeight} />
          </Col>
        </Row>
      </Container>
    )
  }
}
export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(EntryDetail)
)
