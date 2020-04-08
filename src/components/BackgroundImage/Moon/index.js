import React, { memo } from "react"
import PropTypes from "prop-types"
import "../Earth/styles.css"

const styles = ({ top, left, spin, zIndex }) => ({
  width: 80,
  position: "absolute",
  top: `${top}%`,
  left: `${left}%`,
  animation: `spin-earth ${spin}s infinite linear both`,
  zIndex,
})

const Moon = (props) => (
  <img
    alt="Moon"
    style={styles(props)}
    src="http://salehriaz.com/404Page/img/moon.svg"
  />
)

Moon.propTypes = {
  top: PropTypes.number,
  left: PropTypes.number,
  spin: PropTypes.number,
}

Moon.defaultProps = {
  top: 12,
  left: 25,
  spin: 27,
  zIndex: -1,
}

export default memo(Moon)
