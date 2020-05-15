import React from "react"
import PropTypes from "prop-types"
import { EntryTagsProps } from "../../../../redux/Entries/propTypes"
import { connect as reduxConnect } from "react-redux"
import { GoToEntryDetail } from "../../../../redux/router/actions"
import Moment from "react-moment"
import Star from "../../../BackgroundImage/Star"
import "./styles.css"

const mapStateToProps = ({ Window: { isMobile } }) => ({ isMobile })

const EntryPreview = ({
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
  views,
}) =>
  view == "month" && !isMobile ? (
    <div className="TileContent">
      <div
        onClick={() => GoToEntryDetail(id)}
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
        <span className="eventDate mr-1">
          <Moment format="h:mma">{date_created_by_author}</Moment>
        </span>
        <span className="eventTitle Overflow">{title || "No title"}</span>
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
  tags: EntryTagsProps,
  title: PropTypes.string,
  html: PropTypes.string,
  date_created: PropTypes.string,
  date_created_by_author: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
  date_updated: PropTypes.string,
  views: PropTypes.number,
}

export default reduxConnect(mapStateToProps)(EntryPreview)
