import React, { useMemo, memo } from "react"
import PropTypes from "prop-types"
import ToolbarButton from "../ToolbarButton"
import { BasicModal } from "../../../"

const ToolbarModal = ({
  ButtonIcon,
  button,
  xs,
  children,
  disabled = false,
  Component,
  ...restOfProps
}) => {
  const modalButton = useMemo(
    () => (
      <ToolbarButton
        xs={xs}
        ButtonIcon={ButtonIcon}
        title={button}
        disabled={disabled}
      >
        {Component && <Component />}
      </ToolbarButton>
    ),
    [Component, children]
  )
  return (
    <BasicModal {...restOfProps} button={modalButton}>
      {children}
    </BasicModal>
  )
}

ToolbarModal.propTypes = {
  title: PropTypes.string,
  onClickCallback: PropTypes.func,
  onSaveCallback: PropTypes.func,
  onCancelCallback: PropTypes.func,
  ButtonIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  button: PropTypes.string,
  xs: PropTypes.number,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  disabledSave: PropTypes.bool
}

export default memo(ToolbarModal)
