import React, { memo } from "react"
import PropTypes from "prop-types"
import { Col, Button } from "reactstrap"

const ToolbarButton = ({
  xs,
  onClickCallback,
  buttonIcon,
  title,
  disabled
}) => {
  return (
    <Col
      tag={Button}
      className="p-0"
      color="inherit"
      xs={xs}
      onClick={onClickCallback}
      disabled={disabled}
    >
      <i className={buttonIcon} />
      <div>{title}</div>
    </Col>
  )
}

ToolbarButton.propTypes = {
  xs: PropTypes.number,
  onClickCallback: PropTypes.func,
  buttonIcon: PropTypes.string,
  title: PropTypes.string,
  disabled: PropTypes.bool
}

export default memo(ToolbarButton)
