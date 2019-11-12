import React, { memo } from "react"
import PropTypes from "prop-types"
import { getRandomInt } from "../../../helpers"
import "./styles.css"

const styles = ({
  top = getRandomInt(0, 100),
  left = getRandomInt(0, 100),
  animation = getRandomInt(1, 5),
  size
}) => {
  const randomSize = getRandomInt(1, 8)
  return {
    top: `${top}%`,
    left: `${left}%`,
    animation: animation
      ? `glow-star 2s infinite ease-in-out alternate ${animation}s`
      : "none",
    position: "absolute",
    borderRadius: "100%",
    backgroundColor: "#fff",
    width: size || randomSize,
    height: size || randomSize,
    opacity: 0.3,
    willChange: "opacity"
  }
}

const Star = props => <div style={styles(props)} />

Star.propTypes = {
  top: PropTypes.number,
  left: PropTypes.number,
  animation: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  size: PropTypes.number
}

export default memo(Star)
