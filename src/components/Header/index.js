import React, { memo } from "react"
import PropTypes from "prop-types"
import "./styles.css"

const Header = ({ children, className, fill, color, ...restOfProps }) => {
  const styles = {
    backgroundColor: fill,
    color,
    ...restOfProps
  }

  return (
    <div className={className} style={styles}>
      {children}
    </div>
  )
}
Header.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string.isRequired,
  fill: PropTypes.string,
  color: PropTypes.string.isRequired,
  fontSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
}

Header.defaultProps = {
  children: <h1>Header</h1>,
  className: "Header Center",
  fill: "",
  color: "var(--secondaryColor)",
  fontSize: "2em"
}

export default memo(Header)
