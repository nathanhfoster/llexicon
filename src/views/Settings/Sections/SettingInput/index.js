import React, { useState, memo } from "react"
import PropTypes from "prop-types"
import { FormGroup, Label, Input, Tooltip } from "reactstrap"

const SettingInput = ({
  settingKey,
  disabled,
  onClickCallback,
  title,
  tooltipTitle,
  checked
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleTooltip = () => setIsOpen(!isOpen)

  const onClick = () => onClickCallback(settingKey)

  return (
    <FormGroup check>
      <Label check inline={"true"}>
        <Input
          readOnly
          name={settingKey}
          type="radio"
          disabled={disabled}
          checked={checked}
          onClick={onClick}
        />
        <span id={settingKey}>{title}</span>
        <Tooltip
          placement="right"
          isOpen={isOpen}
          target={settingKey}
          toggle={toggleTooltip}
        >
          {tooltipTitle}
        </Tooltip>
      </Label>
    </FormGroup>
  )
}

SettingInput.defaultProps = {
  settingKey: PropTypes.string,
  disabled: PropTypes.bool,
  checked: PropTypes.bool,
  onClickCallback: PropTypes.func,
  title: PropTypes.string,
  tooltipTitle: PropTypes.string
}

export default memo(SettingInput)
