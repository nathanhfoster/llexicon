import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { Container, Row, Col } from "reactstrap"
import { withRouter } from "react-router-dom"
import { RouterPush, RouterLinkPush } from "../../../../helpers/routing"
import Moment from "react-moment"
import "./styles.css"

const mapStateToProps = ({ Window: { isMobile } }) => ({ isMobile })

const mapDispatchToProps = {}

class Content extends PureComponent {
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

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const {
      activeDate,
      view,
      author,
      tags,
      title,
      html,
      date_created,
      date_created_by_author,
      date_updated,
      views,
      isMobile,
      shouldRenderInMobile
    } = props
    this.setState({
      view,
      author,
      tags,
      title,
      html,
      date_created,
      date_created_by_author,
      date_updated,
      views,
      isMobile,
      shouldRenderInMobile
    })
  }

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
    // let mapCounter = {}

    // const dayOfTheYear = calendarDay.dayOfYear()
    // console.log("calendarDay: ", calendarDay)
    // mapCounter[dayOfTheYear] = mapCounter[dayOfTheYear] + 1 || 1

    return view == "month" && !isMobile ? (
      <div class="TileContent">
        <div
          onClick={() => RouterPush(history, `/calendar/event/${id}`)}
          className="hasEventsContainer"
          data-for={`${id}`}
          data-tip={id}
        >
          <span
            className="eventLabelColor"
            style={{ backgroundColor: "var(--primaryColor)" }}
          />
          <span>
            <Moment format="hh:mma">{date_created_by_author}</Moment>
          </span>
          <h6 className="eventTitle">{title}</h6>
        </div>
      </div>
    ) : view == "month" && shouldRenderInMobile ? (
      <div class="hasEventsContainerMobile">
        <span
          className="eventLabelColor"
          style={{ backgroundColor: "var(--primaryColor)" }}
        />
      </div>
    ) : null
  }
}
export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(Content)
)
