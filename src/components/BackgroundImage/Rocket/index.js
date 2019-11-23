import React, { memo } from "react"
import PropTypes from "prop-types"
import "./styles.css"

const styles = ({ top = 75, move = 200 }) => ({
  width: 40,
  zIndex: 101,
  position: "absolute",
  transform: `translateX(-50px)`,
  top: `${top}%`,
  pointerEvents: "none",
  animation: `rocket-movement ${move}s linear infinite both running`
})

const Rocket = props => (
  <img
    style={styles(props)}
    src="http://salehriaz.com/404Page/img/rocket.svg"
  />
)

Rocket.propTypes = {
  top: PropTypes.number,
  move: PropTypes.number
}

export default memo(Rocket)
