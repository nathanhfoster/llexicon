import React, { memo } from "react"
import { Logo } from "../../../images/AWS"

const astronautStyles = ({}) => ({
  width: 80
})

const LogoImage = props => <img style={astronautStyles(props)} src={Logo} />

export default memo(LogoImage)
