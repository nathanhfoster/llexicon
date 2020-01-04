import React, { Component } from "react"
import PropTypes from "prop-types"
import { FormGroup, Label, Input, Tooltip } from "reactstrap"
import deepEquals from "../../../helpers/deepEquals"

class SettingInput extends Component {
  constructor(props) {
    super(props)

    this.state = { isOpen: false }
  }

  static propTypes = {}

  static defaultProps = {
    settingKey: PropTypes.string,
    disabled: PropTypes.bool,
    checked: PropTypes.bool,
    onClickCallback: PropTypes.func,
    title: PropTypes.string,
    tooltipTitle: PropTypes.string
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { checked } = nextProps
    return { checked }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const stateChanged = !deepEquals(this.state, nextState)
    return stateChanged
  }

  toggleTooltip = () =>
    this.setState(currentState => ({ isOpen: !currentState.isOpen }))

  render() {
    const {
      settingKey,
      disabled,
      onClickCallback,
      title,
      tooltipTitle
    } = this.props

    const { checked, isOpen } = this.state

    return (
      <FormGroup check>
        <Label check inline>
          <Input
            readOnly
            name={settingKey}
            type="radio"
            disabled={disabled}
            checked={checked}
            onClick={() => onClickCallback(settingKey)}
          />
          <span id={settingKey}>{title}</span>
          <Tooltip
            placement="right"
            isOpen={isOpen}
            target={settingKey}
            toggle={this.toggleTooltip}
          >
            {tooltipTitle}
          </Tooltip>
        </Label>
      </FormGroup>
    )
  }
}
export default SettingInput
