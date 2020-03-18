import React, { memo } from "react"
import PropTypes from "prop-types"
import { Col } from "reactstrap"

const Scrollable = ({
  className,
  height,
  width,
  reachBottomCallback,
  children
}) => {
  const styles = className ? {} : { height, width }

  const handleScroll = ({
    target: { scrollHeight, scrollTop, clientHeight }
  }) => {
    const reachedBottom = scrollHeight - scrollTop === clientHeight

    console.log(reachedBottom)

    if (reachedBottom) {
      reachBottomCallback(scrollHeight, scrollTop, clientHeight)
    }
  }

  return (
    <div className={className} style={styles} onScroll={handleScroll}>
      {children}
    </div>
  )
}

Scrollable.propTypes = {
  className: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  reachBottomCallback: PropTypes.func.isRequired,
  children: PropTypes.any
}

Scrollable.defaultProps = { height: "100%", width: "100%" }

export default memo(Scrollable)
