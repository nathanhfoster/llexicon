import React, { memo } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { useHistory } from "react-router-dom"
import { RouterPush } from "../../../../ReactRouter/Routes"
import { RouteMap } from "../../../../ReactRouter/Routes"
import Moment from "react-moment"
import Star from "../../../../components/BackgroundImage/Star"
import "./styles.css"

const mapStateToProps = ({ Window: { isMobile } }) => ({ isMobile })

const handleOnClick = id => {
  const history = useHistory()
  RouterPush(history, RouteMap.ENTRY_DETAIL.replace(":entryId", `${id}`))
}

const EntryPreview = ({
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
}) =>
  view == "month" && !isMobile ? (
    <div className="TileContent">
      <div
        onClick={() => handleOnClick(history, id)}
        className="hasEventsContainer"
        data-for={`${id}`}
        data-tip={id}
      >
        <Star
          size={8}
          marginRight={2}
          color="White"
          animation={false}
          opacity={1}
        />
        <span className="eventDate">
          <Moment format="h:mma">{date_created_by_author}</Moment>
        </span>
        <span className="eventTitle">{title || "No title"}</span>
      </div>
    </div>
  ) : view == "month" ? (
    <Star bottom="8px" size={8} color="White" animation={false} opacity={1} />
  ) : null

EntryPreview.propTypes = {
  isMobile: PropTypes.bool,
  view: PropTypes.string,
  id: PropTypes.number,
  author: PropTypes.number,
  tags: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string,
  html: PropTypes.string,
  date_created: PropTypes.string,
  date_created_by_author: PropTypes.string,
  date_updated: PropTypes.string,
  views: PropTypes.number
}

export default memo(
  reduxConnect(mapStateToProps, null)(EntryPreview)
)
