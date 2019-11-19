import React, { memo } from "react"

import "./styles.css"

const LoadingScreen = ({ title = "Loading..." }) => (
  <div className="LoadingScreenContainer">
    <div className="loader">
      <i className="fas fa-feather-alt" style={{ fontSize: 18 }} /> {title}
    </div>
  </div>
)

export default memo(LoadingScreen)
