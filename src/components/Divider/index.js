import React from "react"
import PropTypes from "prop-types"
import "./styles.css"
const Divider = ({ shouldRender = true }) => {
  return shouldRender && <hr className="Divider" />
}

Divider.prototypes = {
  shouldRender: PropTypes.bool
}

export default Divider
