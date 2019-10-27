import React, { PureComponent } from "react"
import "./styles.css"

class Hamburger extends PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    const { onClick, collapsed } = this.props
    const collapseClass = collapsed
      ? "navbar-toggle collapsed"
      : "navbar-toggle"
    return (
      <button type="button" className={collapseClass} onClick={onClick}>
        <span className="icon-bar top-bar" />
        <span className="icon-bar middle-bar" />
        <span className="icon-bar bottom-bar" />
      </button>
    )
  }
}

export default Hamburger
