import React, { memo } from "react"

import "./styles.css"

const LoadingScreen = ({ title = "Loading..." }) => (
  <div className="loader">{title}</div>
)

export default memo(LoadingScreen)
