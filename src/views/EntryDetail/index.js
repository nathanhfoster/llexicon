import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { Container, Row, Col } from "reactstrap"
import Entry from "../../components/Entry"
import { connect as reduxConnect } from "react-redux"
import { withRouter } from "react-router-dom"
import { GetUserEntry } from "../../actions/Entries"
import { RouterPush, RouterLinkPush } from "../../helpers/routing"
import "./styles.css"

const mapStateToProps = (
  {
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
  entry: items.find(entry => entry.id == entryId),
  entryId,
  entryContainerHeight: availHeight - (isMobile ? 46 : 68) - 48
})

const mapDispatchToProps = { GetUserEntry }

class EntryDetail extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {}

  static defaultProps = {}

  componentWillMount() {
    this.getState(this.props)
  }

  componentWillUpdate(nextProps, nextState) {}

  componentDidMount() {
    const { entryId, GetUserEntry } = this.props
    GetUserEntry(entryId)
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const { entry, entryContainerHeight } = props
    this.setState({ entry, entryContainerHeight })
  }

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

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
