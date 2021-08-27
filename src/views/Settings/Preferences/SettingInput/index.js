import React, { useReducer, memo } from 'react'
import PropTypes from 'prop-types'
import { FormGroup, Label, Input, Tooltip } from 'reactstrap'

const SettingInput = ({ settingKey, disabled, onClick, title, tooltipTitle, checked }) => {
  const [isOpen, toggleTooltip] = useReducer(prevState => !prevState, false)

  const handleOnClick = () => onClick(settingKey)

  return (
    <FormGroup check>
      <Label check inline={'true'}>
        <Input
          readOnly
          name={settingKey}
          type='radio'
          disabled={disabled}
          checked={checked}
          onClick={handleOnClick}
        />
        <span id={settingKey}>{title}</span>
        <Tooltip placement='right' isOpen={isOpen} target={settingKey} toggle={toggleTooltip}>
          {tooltipTitle}
        </Tooltip>
      </Label>
    </FormGroup>
  )
}

SettingInput.propTypes = {
  settingKey: PropTypes.string,
  disabled: PropTypes.bool,
  checked: PropTypes.bool,
  onClick: PropTypes.func,
  title: PropTypes.string,
  tooltipTitle: PropTypes.string,
}

SettingInput.defaultProps = {
  disabled: false,
}

export default memo(SettingInput)
