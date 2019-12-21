import React, { memo } from "react"
import PropTypes from "prop-types"
import { Col, Button } from "reactstrap"
import "./styles.css"

const ToolbarButton = ({
  xs,
  onClickCallback,
  ButtonIcon,
  title,
  disabled,
  children
}) => {
  return (
    <Col
      tag={Button}
      className="ToolbarButton p-0"
      color="inherit"
      xs={xs}
      onClick={onClickCallback}
      disabled={disabled}
    >
      {typeof ButtonIcon === "string" ? (
        <i className={ButtonIcon} />
      ) : (
        <ButtonIcon key={title} />
      )}
      <div>{title}</div>
    </Col>
  )
}

ToolbarButton.propTypes = {
  xs: PropTypes.number,
  onClickCallback: PropTypes.func,
  ButtonIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  title: PropTypes.string,
  disabled: PropTypes.bool
}

export default memo(ToolbarButton)
