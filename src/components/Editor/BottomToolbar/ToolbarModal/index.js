import React, { memo } from "react"
import PropTypes from "prop-types"
import ToolbarButton from "../ToolbarButton"
import BasicModal from "../../../BasicModal"

const ToolbarModal = ({
  ButtonIcon,
  button,
  xs,
  children,
  disabled = false,
  Component,
  ...restOfProps
}) => (
  <BasicModal
    {...restOfProps}
    button={
      <ToolbarButton
        xs={xs}
        ButtonIcon={ButtonIcon}
        title={button}
        disabled={disabled}
      >
        {Component && <Component />}
      </ToolbarButton>
    }
  >
    {children}
  </BasicModal>
)

ToolbarModal.propTypes = {
  title: PropTypes.string,
  onClickCallback: PropTypes.func,
  onSaveCallback: PropTypes.func,
  onCancelCallback: PropTypes.func,
  ButtonIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  button: PropTypes.string,
  xs: PropTypes.number,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  disabledSave: PropTypes.bool,
}

export default memo(ToolbarModal)
