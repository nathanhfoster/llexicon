import React, { Component } from "react"
import PropTypes from "prop-types"
import { Row, Col, FormGroup, Label, Input, Tooltip } from "reactstrap"
import deepEquals from "../../../helpers/deepEquals"
import "./styles.css"

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

  shouldComponentUpdate(nextProps, nextState) {
    const propsChanged = !deepEquals(this.props, nextProps)
    return propsChanged
  }

  toggleTooltip = () =>
    this.setState(currentState => ({ isOpen: !currentState.isOpen }))

  render() {
    const {
      settingKey,
      disabled,
      checked,
      onClickCallback,
      title,
      tooltipTitle
    } = this.props
    const { isOpen } = this.state
    console.log("RENDER")
    return (
      <Row tag={FormGroup} check className="checkBoxTable">
        <Col tag={Label} check xs={12}>
          <Input
            readOnly
            type="radio"
            disabled={disabled}
            checked={checked}
            onClick={() => onClickCallback(settingKey)}
          />
          <span className="checkBoxText" id={settingKey}>
            {title}
          </span>
          <Tooltip
            placement="right"
            isOpen={isOpen}
            target={settingKey}
            toggle={this.toggleTooltip}
          >
            {tooltipTitle}
          </Tooltip>
        </Col>
      </Row>
    )
  }
}
export default SettingInput
