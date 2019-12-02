import React, { memo } from "react"
import PropTypes from "prop-types"
import { Badge } from "reactstrap"
import { connect as reduxConnect } from "react-redux"
import { useHistory } from "react-router-dom"
import { RouteMap, RouterPush } from "../../ReactRouter/Routes"
import Moment from "react-moment"
import Star from "../BackgroundImage/Star"

import "./styles.css"

const EntryMinimal = ({
  id,
  title,
  html,
  date_created_by_author,
  lastUpdated,
  EntryFiles = [],
  author,
  date_create,
  date_updated,
  latitude,
  longitude,
  tags = [],
  views
}) => {
  const history = useHistory()

  return (
    <Badge
      className="EntryMinimal"
      onClick={() =>
        RouterPush(history, RouteMap.ENTRY_DETAIL.replace(":entryId", `${id}`))
      }
    >
      <div className="Center" style={{ justifyContent: "flex-start" }}>
        <span>
          <Star size={16} animation={false} opacity={1} />{" "}
        </span>
        <Moment format="D MMM">{date_created_by_author}</Moment>

        {EntryFiles.length > 0 && (
          <span style={{ marginLeft: 4 }}>
            <i className="far fa-file-image" />
          </span>
        )}
        <span style={{ marginLeft: 4 }}>{title}</span>
      </div>
    </Badge>
  )
}

EntryMinimal.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  title: PropTypes.string,
  html: PropTypes.string,
  date_created_by_author: PropTypes.string,
  EntryFiles: PropTypes.arrayOf(PropTypes.object)
}

export default memo(EntryMinimal)
