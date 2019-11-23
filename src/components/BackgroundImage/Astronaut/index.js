import React, { memo } from "react"
import PropTypes from 'prop-types'
import "./styles.css"

const containerStyles = ({ top = 60, right = 20, move = 50 }) => ({
  zIndex: 101,
  position: "absolute",
  top: `${top}%`,
  right: `${right}%`,
  willChange: `transform`,
  animation: `move-astronaut ${move}s infinite linear both alternate`
})

const astronautStyles = ({ rotate = 200 }) => ({
  width: 140,
  animation: `rotate-astronaut ${rotate}s infinite linear both alternate`
})

const Astronaut = props => (
  <div style={containerStyles(props)}>
    <img
      style={astronautStyles(props)}
      src="http://salehriaz.com/404Page/img/astronaut.svg"
    />
  </div>
)

Astronaut.propTypes = {
  top: PropTypes.number,
  right: PropTypes.number,
  move: PropTypes.number
}

export default memo(Astronaut)
