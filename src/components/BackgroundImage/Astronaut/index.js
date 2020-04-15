import React, { memo } from "react"
import PropTypes from "prop-types"
import { astronaut } from "../../../images/AWS"
import "./styles.css"

const containerStyles = ({ top, right, move, zIndex }) => ({
  position: "absolute",
  top: `${top}%`,
  right: `${right}%`,
  willChange: `transform`,
  animation: `move-astronaut ${move}s infinite linear both alternate`,
  zIndex,
})

const astronautStyles = ({ rotate }) => ({
  width: 140,
  animation: `rotate-astronaut ${rotate}s infinite linear both alternate`,
})

const Astronaut = (props) => (
  <div style={containerStyles(props)}>
    <img style={astronautStyles(props)} src={astronaut} />
  </div>
)

Astronaut.propTypes = {
  top: PropTypes.number,
  right: PropTypes.number,
  move: PropTypes.number,
}

Astronaut.defaultProps = {
  top: 60,
  right: 20,
  move: 50,
  rotate: 200,
  zIndex: 0,
}

export default memo(Astronaut)
