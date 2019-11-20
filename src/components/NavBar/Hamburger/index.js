import React, { memo } from "react"
import "./styles.css"

const Hamburger = ({ onClick, collapsed }) => {
  const collapseClass = collapsed ? "navbar-toggle collapsed" : "navbar-toggle"
  return (
    <button type="button" className={collapseClass} onClick={onClick}>
      <span className="icon-bar top-bar" />
      <span className="icon-bar middle-bar" />
      <span className="icon-bar bottom-bar" />
    </button>
  )
}

export default memo(Hamburger)
