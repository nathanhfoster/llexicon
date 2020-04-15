import React, { memo } from "react"
import PropTypes from "prop-types"
import "./styles.css"

const styles = ({ top, move, zIndex }) => ({
  width: 40,

  position: "absolute",
  transform: `translateX(-50px)`,
  top: `${top}%`,
  pointerEvents: "none",
  animation: `rocket-movement ${move}s linear infinite both running`,
  zIndex,
})

const Rocket = (props) => (
  <img
    style={styles(props)}
    src="https://salehriaz.com/404Page/img/rocket.svg"
  />
)

Rocket.propTypes = {
  top: PropTypes.number,
  move: PropTypes.number,
}

Rocket.defaultProps = {
  top: 75,
  move: 200,
  zIndex: -1,
}

export default memo(Rocket)
