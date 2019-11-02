import React, { memo } from "react"

import "./styles.css"

const LoadingScreen = ({ title = "Loading..." }) => (
  <div className="loader">
    <i className="fas fa-feather-alt" style={{ fontSize: 18}} /> {title}
  </div>
)

export default memo(LoadingScreen)
