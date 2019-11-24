import React, { memo } from "react"
import PropTypes from "prop-types"
import { Badge } from "reactstrap"
import { connect as reduxConnect } from "react-redux"
import { useHistory } from "react-router-dom"
import { RouteMap, RouterPush } from "../../ReactRouter/Routes"
import Star from "../BackgroundImage/Star"

import "./styles.css"

const EntryMinimal = ({ id, title, html, EntryFiles, ...restOfProps }) => {
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
          <Star inherit size={16} />
        </span>

        {EntryFiles.length > 0 && (
          <span>
            <i className="far fa-file-image" />
          </span>
        )}
        <span>{title}</span>
      </div>
    </Badge>
  )
}

EntryMinimal.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  title: PropTypes.string
}

export default memo(EntryMinimal)
