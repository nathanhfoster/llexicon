import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { withRouter } from "react-router-dom"
import { RouterPush } from "../../../../ReactRouter/Routes"
import { RouteMap } from "../../../../ReactRouter/Routes"
import Moment from "react-moment"
import Star from "../../../../components/BackgroundImage/Star"
import deepEquals from "../../../../helpers/deepEquals"
import "./styles.css"

const mapStateToProps = ({ Window: { isMobile } }) => ({ isMobile })

class EntryPreview extends Component {
  static propTypes = {}

  static defaultProps = {}

  shouldComponentUpdate(nextProps, nextState) {
    const propsChanged = !deepEquals(this.props, nextProps)
    return propsChanged
  }

  handleOnClick = () => {
    const { history, id } = this.props
    RouterPush(history, RouteMap.ENTRY_DETAIL.replace(":entryId", `${id}`))
  }

  render() {
    const {
      history,
      location,
      match,
      isMobile,
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
    } = this.props

    return view == "month" && !isMobile ? (
      <div className="TileContent">
        <div onClick={this.handleOnClick} className="hasEventsContainer" data-for={`${id}`} data-tip={id}>
          <Star size={8} marginRight={2} color="White" animation={false} opacity={1} />
          <span className="eventDate">
            <Moment format="h:mma">{date_created_by_author}</Moment>
          </span>
          <span className="eventTitle">{title || "No title"}</span>
        </div>
      </div>
    ) : view == "month" ? (
      <Star bottom="8px" size={8} color="White" animation={false} opacity={1} />
    ) : null
  }
}
export default withRouter(reduxConnect(mapStateToProps, null)(EntryPreview))
