import React, { memo } from "react"
import PropTypes from "prop-types"
import { rocket } from "../../../images/AWS"
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

const Rocket = (props) => <img style={styles(props)} src={rocket} />

Rocket.propTypes = {
  top: PropTypes.number,
  move: PropTypes.number,
}

Rocket.defaultProps = {
  top: 75,
  move: 200,
  zIndex: 0,
}

export default memo(Rocket)
