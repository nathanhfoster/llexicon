import React, { memo } from "react"
import PropTypes from "prop-types"
import "../Earth/styles.css"

const styles = ({ top = 12, left = 25, spin = 27 }) => ({
  width: 80,
  position: "absolute",
  top: `${top}%`,
  left: `${left}%`,
  zIndex: 101,
  animation: `spin-earth ${spin}s infinite linear both`
})

const Moon = props => (
  <img
    alt="Moon"
    style={styles(props)}
    src="http://salehriaz.com/404Page/img/moon.svg"
  />
)

Moon.propTypes = {
  top: PropTypes.number,
  left: PropTypes.number,
  spin: PropTypes.number
}

export default memo(Moon)
