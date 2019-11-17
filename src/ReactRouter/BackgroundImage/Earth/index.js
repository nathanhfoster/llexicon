import React, { memo } from "react"
import PropTypes from "prop-types"
import "./styles.css"

const styles = ({ top = 20, left = 15, spin = 100 }) => ({
  width: 100,
  position: "absolute",
  top: `${top}%`,
  left: `${left}%`,
  zIndex: 101,
  animation: `spin-earth ${spin}s infinite linear both`
})

const Earth = props => (
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
  spin: PropTypes.number
}

export default memo(Earth)
