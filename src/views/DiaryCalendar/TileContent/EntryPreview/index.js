import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { Container, Row, Col } from "reactstrap"
import { withRouter } from "react-router-dom"
import { RouterPush, RouterLinkPush } from "../../../../ReactRouter/Routes"
import { RouteMap } from "../../../../ReactRouter/Routes"
import Moment from "react-moment"
import "./styles.css"

const mapStateToProps = ({ Window: { isMobile } }) => ({ isMobile })

const mapDispatchToProps = {}

class EntryPreview extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {}

  static defaultProps = {}

  static getDerivedStateFromProps(nextProps, prevState) {
    return nextProps
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  render() {
    const { history, location, match } = this.props
    const {
      isMobile,
      shouldRenderInMobile,
      view,
      id,
      author,
      tags,
      title,
      html,
      date_created,
      date_created_by_author,
      date_updated,
      views
    } = this.state

    const { ENTRY_DETAIL } = RouteMap

    return view == "month" && !isMobile ? (
      <div className="TileContent">
        <div
          onClick={() =>
            RouterPush(history, ENTRY_DETAIL.replace(":entryId", `${id}`))
          }
          className="hasEventsContainer"
          data-for={`${id}`}
          data-tip={id}
        >
          <span
            className="eventLabelColor"
            style={{ backgroundColor: "var(--secondaryColor)" }}
          />
          <span className="eventDate">
            <Moment format="hh:mma">{date_created_by_author}</Moment>
          </span>
          <span className="eventTitle">{title}</span>
        </div>
      </div>
    ) : view == "month" && shouldRenderInMobile ? (
      <span
        className="eventLabelColor"
        style={{ backgroundColor: "var(--secondaryColor)" }}
      />
    ) : null
  }
}
export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(EntryPreview)
)
