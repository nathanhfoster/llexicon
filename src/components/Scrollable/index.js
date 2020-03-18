import React, { useState, useEffect, useMemo, memo } from "react"
import PropTypes from "prop-types"

const getInitialState = ({}) => {
  return {}
}

const Scrollable = ({ reachBottomCallback }) => {
  const handleScroll = ({
    target: { scrollHeight, scrollTop, clientHeight }
  }) => {
    const reachedBottom = scrollHeight - scrollTop === clientHeight

    console.log(reachedBottom)

    if (reachedBottom) {
      reachBottomCallback(scrollHeight, scrollTop, clientHeight)
    }
  }

  return <div className="Scrollable Container">Scrollable</div>
}

Scrollable.propTypes = {}

Scrollable.defaultProps = {}

export default memo(Scrollable)
