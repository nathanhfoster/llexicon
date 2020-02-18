import React, { memo } from "react"
import PropTypes from "prop-types"
import "./styles.css"

const EntryCardTitle = ({ title }) => (
  <div className="EntryCardTitleContainer">
    <span className="EntryCardTitle">{title}</span>
  </div>
)

EntryCardTitle.propTypes = { title: PropTypes.string }

EntryCardTitle.defaultProps = { title: "No title..." }

export default memo(EntryCardTitle)
