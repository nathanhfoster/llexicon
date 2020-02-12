import React, { useEffect, useState, memo } from "react"
import PropTypes from "prop-types"
import moment from "moment"
import { K_CIRCLE_SIZE, K_POP_UP_ANIMATION } from "./styles"
import { TagsContainer } from "../../../components"

const HEIGHT = 100
const WIDTH = 200

const rootStyles = {
  display: "block",
  margin: "auto",
  padding: "6px",
  alignContent: "center",
  justifyContent: "center",
  textAlign: "center",
  height: HEIGHT,
  width: WIDTH,
  position: "absolute",
  left: -(WIDTH / 2) + 16,
  bottom: K_CIRCLE_SIZE - 2,
  zIndex: 999,
  backgroundColor: "white",
  color: "black",
  boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
  borderRadius: 4
}

const mountedStyles = { ...rootStyles, ...K_POP_UP_ANIMATION }

const lineStyle = {
  marginTop: 8,
  height: K_CIRCLE_SIZE,
  width: "calc(100% - 12px)",
  borderTop: "1px solid #808080",
  position: "absolute",
  bottom: 0
}

const column = {
  position: "absolute",
  bottom: "calc(50% - 4px)"
}

const leftColumn = {
  ...column,
  left: 0
}

const rightColumn = {
  ...column,
  right: 0
}

const PreviewBox = ({
  $dimensionKey,
  clientName,
  lastActivity,
  title,
  date_created_by_author,
  _lastUpdated,
  address,
  tags,
  ...rest
}) => {
  const [styles, setStyles] = useState(rootStyles)

  useEffect(() => {
    setStyles(mountedStyles)
  }, [])

  if ($dimensionKey === "MyLocation") {
    title = "Me"
  }

  date_created_by_author = moment(
    date_created_by_author || _lastUpdated
  ).format("MM/DD/YYYY")

  return (
    <div style={styles}>
      <div>{title}</div>
      <div>{address}</div>
      {tags && (
        <div>
          <TagsContainer tags={tags} />
        </div>
      )}
      <div style={lineStyle}>
        <div style={leftColumn}>
          <i>Date</i>
        </div>
        <div style={rightColumn}>
          <i>{date_created_by_author}</i>
        </div>
      </div>
    </div>
  )
}

PreviewBox.propTypes = {
  $dimensionKey: PropTypes.string,
  clientName: PropTypes.string,
  siteDescription: PropTypes.string,
  score: PropTypes.number,
  lastActivity: PropTypes.string
}

export default memo(PreviewBox)
