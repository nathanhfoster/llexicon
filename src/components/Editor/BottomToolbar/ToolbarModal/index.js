import React, { memo } from "react"
import PropTypes from "prop-types"
import ToolbarButton from "../ToolbarButton"
import BasicModal from "../../../BasicModal"

const ToolbarModal = ({
  ButtonIcon,
  buttonTitle,
  xs,
  children,
  disabled = false,
  Component,
  ...restOfProps
}) => {
  return (
    <BasicModal
      {...restOfProps}
      ModalButton={
        <ToolbarButton
          xs={xs}
          ButtonIcon={ButtonIcon}
          title={buttonTitle}
          disabled={disabled}
        >
          {Component && <Component />}
        </ToolbarButton>
      }
    >
      {children}
    </BasicModal>
  )
}

ToolbarModal.propTypes = {
  modalTitle: PropTypes.string,
  onClickCallback: PropTypes.func,
  onSaveCallback: PropTypes.func,
  onCancelCallback: PropTypes.func,
  ButtonIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  buttonTitle: PropTypes.string,
  xs: PropTypes.number,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  saveDisabled: PropTypes.bool
}

export default memo(ToolbarModal)
