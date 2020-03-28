import React, { memo } from "react"
import PropTypes from "prop-types"
import "./styles.css"

const containerStyles = ({ top, right, spin }) => ({
  width: 80,
  position: "absolute",
  top: `${top}%`,
  right: `${right}%`,
  zIndex: 101,
  animation: `spin-earth ${spin}s infinite linear both`
})

const MoonUfo = props => (
  <div style={containerStyles(props)}>
    <div className="moon behind"></div>
    <div className="moon"></div>
  </div>
)

MoonUfo.propTypes = {
  top: PropTypes.number,
  left: PropTypes.number,
  spin: PropTypes.number
}

MoonUfo.defaultProps = {
  top: 10,
  right: 10,
  sping: 27
}

export default memo(MoonUfo)
