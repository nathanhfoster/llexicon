import React from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"

const mapStateToProps = ({ Window: { innerHeight, innerWidth } }) => ({
  innerHeight,
  innerWidth
})

const ViewPortContainer = ({
  innerHeight,
  innerWidth,
  className,
  children
}) => {
  const containerStyles = { height: innerHeight, width: innerWidth }
  return (
    <div className={className} style={containerStyles}>
      {children}
    </div>
  )
}

ViewPortContainer.propTypes = {
  innerHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  innerWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

ViewPortContainer.defaultProps = {
  className: "ViewPortContainer"
}

export default reduxConnect(mapStateToProps)(ViewPortContainer)
