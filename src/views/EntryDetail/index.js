import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { Container, Row, Col } from "reactstrap"
import Entry from "../../components/Entry"
import { connect as reduxConnect } from "react-redux"
import { withRouter } from "react-router-dom"
import { GetUserEntryDetails, SyncEntries } from "../../actions/Entries"
import { RouterPush, RouterLinkPush } from "../../ReactRouter/Routes"
import PageNotFound from "../PageNotFound"
import "./styles.css"

const mapStateToProps = (
  {
    User,
    Entries: { items, filteredItems },
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
    .concat(filteredItems)
    .filter(item => !item.shouldDelete)
    .find(entry => entry.id == entryId),
  entryId,
  entryContainerHeight: availHeight - (isMobile ? 46 : 68) - 48
})

const mapDispatchToProps = { GetUserEntryDetails, SyncEntries }

class EntryDetail extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {
    UserId: PropTypes.number,
    GetUserEntryDetails: PropTypes.func.isRequired,
    SyncEntries: PropTypes.func.isRequired
  }

  static defaultProps = {}

  static getDerivedStateFromProps(nextProps, prevState) {
    return nextProps
  }

  componentDidMount() {
    const { entryId, SyncEntries, GetUserEntryDetails } = this.props
    SyncEntries(
      () => new Promise(resolve => resolve(GetUserEntryDetails(entryId)))
    )
  }

  render() {
    const { entry, entryContainerHeight } = this.state
    return entry ? (
      <Container fluid className="Container">
        <Row>
          <Col xs={12} className="EntryDetail p-0">
            <Entry
              entry={entry}
              // containerHeight={entryContainerHeight}
              shouldRedirectOnDelete
              topToolbarHidden={false}
            />
          </Col>
        </Row>
      </Container>
    ) : (
      <PageNotFound title={"Entry Not Found"} />
    )
  }
}
export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(EntryDetail)
)
