import React, { useState, memo, Fragment, cloneElement } from "react"
import PropTypes from "prop-types"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap"
import "./styles.css"

const BasicModal = ({
  show,
  title,
  onClickCallback,
  onSaveCallback,
  onCancelCallback,
  children,
  className,
  disabled,
  disabledSave,
  button,
  buttonTitle,
  footer,
  saveButton,
  cancelButton
}) => {
  const [isOpen, setIsOpen] = useState(show)

  const toggle = () => setIsOpen(!isOpen)

  const handleClose = () => {
    onCancelCallback && onCancelCallback()
    toggle()
  }

  const handleSave = () => {
    onSaveCallback && onSaveCallback()
    handleClose()
  }

  const shouldShowModal = show !== undefined ? show : isOpen

  return (
    <Fragment>
      {button === false ? null : button ? (
        cloneElement(button, {
          ...button.props,
          disabled,
          onClick: () => {
            const { onClick } = button.props
            onClick && onClick()
            toggle()
          },
          onClickCallback: () => {
            onClickCallback && onClickCallback()
            toggle()
          }
        })
      ) : (
        <Button
          color="primary"
          disabled={disabled}
          onClick={() => {
            onClickCallback && onClickCallback()
            toggle()
          }}
        >
          {buttonTitle}
        </Button>
      )}
      <Modal
        isOpen={shouldShowModal}
        toggle={toggle}
        className="BasicModal"
        size="lg"
        centered
        onClosed={onCancelCallback}
      >
        <ModalHeader
          toggle={toggle}
          style={{
            justifyContent:
              typeof title === "string" ? "center" : "space-between"
          }}
        >
          {title}
        </ModalHeader>
        <ModalBody className={className}>{children}</ModalBody>
        <ModalFooter className="Center">
          {footer || (
            <Fragment>
              {cloneElement(cancelButton, { onClick: handleClose })}
              {cloneElement(saveButton, {
                disabled: disabledSave,
                onClick: handleSave
              })}
            </Fragment>
          )}
        </ModalFooter>
      </Modal>
    </Fragment>
  )
}

BasicModal.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onClickCallback: PropTypes.func,
  onSaveCallback: PropTypes.func,
  onCancelCallback: PropTypes.func,
  buttonTitle: PropTypes.string,
  xs: PropTypes.number,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  disabledSave: PropTypes.bool,
  button: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
    PropTypes.bool
  ]),
  footer: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
}

BasicModal.defaultProps = {
  cancelButton: <Button color="danger">Cancel</Button>,
  saveButton: (
    <Button className="mr-1" color="primary">
      Save
    </Button>
  ),
  disabled: false,
  disabledSave: false
}

export default memo(BasicModal)
