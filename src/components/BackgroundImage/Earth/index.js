import React, { memo } from "react"
import PropTypes from "prop-types"
import "./styles.css"

const styles = ({ top, left, spin, zIndex }) => ({
  width: 100,
  position: "absolute",
  top: `${top}%`,
  left: `${left}%`,
  animation: `spin-earth ${spin}s infinite linear both`,
  zIndex,
})

const Earth = (props) => (
  <img
    alt="Earth"
    style={styles(props)}
    // className="spinEarthOnHover"
    src="http://salehriaz.com/404Page/img/earth.svg"
  />
)

Earth.propTypes = {
  top: PropTypes.number,
  left: PropTypes.number,
  spin: PropTypes.number,
}

Earth.defaultProps = {
  top: 20,
  left: 15,
  spin: 100,
  zIndex: -1,
}

export default memo(Earth)
