import React from "react"
import PropTypes from "prop-types"

const ButtonContainer = ({
  title,
  children,
  disabled,
  onClickCallback,
  styles
}) => {
  let className = "rdw-option-wrapper"
  if (disabled) className += " rdw-option-disabled"

  return (
    <div
      onClick={() => onClickCallback()}
      title={title}
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: 6,
        // position: "relative",
        flexWrap: "wrap",
        ...styles
      }}
    >
      <div className={className}>{children}</div>
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
