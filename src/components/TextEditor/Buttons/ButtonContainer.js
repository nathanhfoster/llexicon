import React from "react"
import PropTypes from "prop-types"

const ButtonContainer = ({ title, children, disabled, onClick }) => {
  let className = "rdw-option-wrapper"
  if (disabled) className += " rdw-option-disabled"
  return (
    <div className={className} onClick={() => onClick()} title={title}>
      {children}
    </div>
  )
}

ButtonContainer.propTypes = {
  title: PropTypes.string,
  children: PropTypes.object,
  disabled: PropTypes.bool,
  onClick: PropTypes.func
}

export default ButtonContainer
