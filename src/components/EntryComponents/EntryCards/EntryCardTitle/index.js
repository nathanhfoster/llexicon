import React, { memo } from "react"
import PropTypes from "prop-types"
import "./styles.css"

const EntryCardTitle = ({ title, is_public }) => (
  <div className="Overflow">
    <i className={`fas fa-lock${is_public ? "-open" : ""} mr-1`} />
    <span className="EntryCardTitle">{title}</span>
  </div>
)

EntryCardTitle.propTypes = {
  title: PropTypes.string,
  is_public: PropTypes.bool,
}

EntryCardTitle.defaultProps = { title: "No title..." }

export default memo(EntryCardTitle)
