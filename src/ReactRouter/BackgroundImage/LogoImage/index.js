import React, { memo } from "react"
import PropTypes from "prop-types"
import { Logo } from "../../../images/AWS"

const containerStyles = ({ zIndex = 102 }) => ({
  zIndex
})

const imageStyles = ({ height = 98, width = 84 }) => ({
  height,
  width
})

const LogoImage = props => (
  <div style={containerStyles(props)} className={props.center ? "Center" : ""}>
    <img style={imageStyles(props)} src={Logo} />
  </div>
)

LogoImage.propTypes = {
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  center: PropTypes.bool
}

export default memo(LogoImage)
