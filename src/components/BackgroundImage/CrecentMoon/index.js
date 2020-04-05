import React, { memo } from "react"
import PropTypes from "prop-types"

const containerStyles = ({ size, top, left }) => ({
  height: size,
  width: size,
  position: "absolute",
  top: `${top}%`,
  left: `${left}%`,
  zIndex: 101
  // animation: `spin-earth ${spin}s infinite linear both`
})

const moonStyles = ({ size, color, blur }) => {
  const moonShape = size / 10
  const innerGlow = size / 20
  return {
    position: "absolute",
    borderRadius: "50%",
    marginTop: "25%",
    marginLeft: "25%",
    width: "50%",
    height: "50%",
    boxShadow: `inset ${innerGlow}px -${innerGlow}px ${color}, inset ${moonShape}px -${moonShape}px ${blur}px ${color}`
  }
}

const CrecentMoon = props => (
  <div style={containerStyles(props)}>
    <div style={moonStyles(props)} />
  </div>
)

CrecentMoon.propTypes = {
  size: PropTypes.number,
  top: PropTypes.number,
  left: PropTypes.number,
  color: PropTypes.string,
  blur: PropTypes.number
}

CrecentMoon.defaultProps = {
  size: 300,
  top: 2.5,
  left: -2.5,
  color: "#b9cce4",
  blur: 10
}

export default memo(CrecentMoon)
