import React, { memo } from "react"
import PropTypes from "prop-types"
import { Logo } from "../../../images/AWS"

const containerStyles = ({ containerStyles }) => ({
  ...containerStyles
})

const imageStyles = ({ size, height, width }) => ({
  height: size || height,
  width: size || width || "auto",
  verticalAlign: "inherit",
  margin: "auto"
})

const LogoImage = props => (
  <div style={containerStyles(props)} className={`${props.className} ${props.center ? "Center" : ""}`}>
    <img style={imageStyles(props)} src={Logo} />
  </div>
)

LogoImage.propTypes = {
  containerStyles: PropTypes.object,
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  center: PropTypes.bool
}

LogoImage.defaultProps = { height: 98, zIndex: 102, className: "" }

export default memo(LogoImage)
