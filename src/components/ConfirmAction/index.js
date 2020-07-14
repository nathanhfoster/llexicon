import React, { useCallback, useMemo, memo } from "react"
import PropTypes from "prop-types"
import { BasicModal } from "../"
import { Button } from "reactstrap"

const ConfirmAction = ({
  button,
  title,
  message,
  onConfirm,
  onCancel,
  size,
  disabled,
}) => {
  const handleConfirm = useCallback(() => {
    onConfirm && onConfirm()
  }, [])
  const handleCancel = useCallback(() => {
    onCancel && onCancel()
  }, [])

  const saveButton = useMemo(() => <Button color="danger">Confirm</Button>, [])

  const cancelButton = useMemo(
    () => <Button color="primary">Cancel</Button>,
    []
  )

  return (
    <BasicModal
      size={size}
      button={button}
      title={title}
      onSaveCallback={handleConfirm}
      onCancelCallback={handleCancel}
      disabled={disabled}
      saveButton={saveButton}
      cancelButton={cancelButton}
    >
      <span className="Center">{message}</span>
    </BasicModal>
  )
}

ConfirmAction.propTypes = {
  button: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  title: PropTypes.string,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
}

ConfirmAction.defaultProps = {
  title: "Delete",
  button: (
    <Button color="danger">
      <i className="fas fa-trash-alt mr-1" />
      Delete
    </Button>
  ),
  message: "Are you sure you want to delete complete this action?",
  size: "lg",
  disabled: false,
}

export default memo(ConfirmAction)
