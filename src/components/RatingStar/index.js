import React, { memo } from "react"
import PropTypes from "prop-types"
import "./styles.css"

const RatingStar = ({
  value,
  filled,
  onMouseEnterCallback,
  onMouseLeaveCallback,
  onClickCallback
}) => {
  const handleMouseEnter = () =>
    onMouseEnterCallback && onMouseEnterCallback(value)

  const handleMouseLeave = () =>
    onMouseLeaveCallback && onMouseLeaveCallback(value)

  const handleOnClick = () => onClickCallback && onClickCallback(value)

  return (
    <span>
      <i
        className={`${
          filled ? "fas" : "far"
        } fa-star fa-2x pt-3 pb-3 pl-1 pr-1 RatingStar`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleOnClick}
      />
    </span>
  )
}

RatingStar.propTypes = {
  value: PropTypes.number,
  filled: PropTypes.bool.isRequired,
  onClickCallback: PropTypes.func.isRequired,
  onMouseEnterCallback: PropTypes.func.isRequired,
  onMouseLeaveCallback: PropTypes.func.isRequired
}

RatingStar.defaultProps = {
  filled: false
}

export default memo(RatingStar)
