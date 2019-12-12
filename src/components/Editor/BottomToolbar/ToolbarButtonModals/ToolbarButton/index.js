import React, { memo } from "react"
import PropTypes from "prop-types"
import { Col, Button } from "reactstrap"

const ToolbarButton = ({ xs, onClickCallback, icon, title }) => {
  return (
    <Col
      tag={Button}
      className="p-0"
      color="inherit"
      xs={xs}
      onClick={onClickCallback}
    >
      <i className={icon} />
      <div>{title}</div>
    </Col>
  )
}

ToolbarButton.propTypes = {
  xs: PropTypes.number,
  onClickCallback: PropTypes.func,
  icon: PropTypes.string,
  title: PropTypes.string
}

export default memo(ToolbarButton)
