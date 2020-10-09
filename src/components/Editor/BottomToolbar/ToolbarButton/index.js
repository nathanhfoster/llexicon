import React, { cloneElement, memo } from 'react'
import PropTypes from 'prop-types'
import { Col, Button } from 'reactstrap'
import './styles.css'

const ToolbarButton = ({ xs, onClick, ButtonIcon, title, disabled }) => {
  return (
    <Col
      tag={Button}
      className='ToolbarButton p-0'
      color='inherit'
      xs={xs}
      onClick={onClick}
      disabled={disabled}
    >
      {typeof ButtonIcon === 'string' ? (
        <i className={ButtonIcon} />
      ) : (
        cloneElement(ButtonIcon, {
          ...ButtonIcon.props,
          key: title,
        })
      )}
      <div>{title}</div>
    </Col>
  )
}

ToolbarButton.propTypes = {
  xs: PropTypes.number,
  onClick: PropTypes.func,
  ButtonIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  title: PropTypes.string,
  disabled: PropTypes.bool,
}

export default memo(ToolbarButton)
