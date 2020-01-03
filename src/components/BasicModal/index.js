import React, { useState, memo, Fragment, cloneElement } from "react"
import PropTypes from "prop-types"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap"
import "./styles.css"

const BasicModal = ({
  modalTitle,
  onClickCallback,
  onSaveCallback,
  onCancelCallback,
  children,
  className,
  disabled = false,
  saveDisabled = false,
  ModalButton,
  ModalButtonTitle
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen(!isOpen)

  return (
    <Fragment>
      {ModalButton ? (
        cloneElement(ModalButton, {
          ...ModalButton.props,
          disabled,
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
          {ModalButtonTitle}
        </Button>
      )}
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        className="BasicModal"
        size="lg"
        centered
        onClosed={onCancelCallback}
      >
        <ModalHeader toggle={toggle} className="Center">
          {modalTitle}
        </ModalHeader>
        <ModalBody className={className}>{children}</ModalBody>
        <ModalFooter className="Center">
          <Button
            color="primary"
            onClick={() => {
              onSaveCallback && onSaveCallback()
              toggle()
            }}
            disabled={saveDisabled}
          >
            Save
          </Button>{" "}
          <Button color="danger" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </Fragment>
  )
}

BasicModal.propTypes = {
  modalTitle: PropTypes.string,
  onClickCallback: PropTypes.func,
  onSaveCallback: PropTypes.func,
  onCancelCallback: PropTypes.func,
  ButtonIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  buttonTitle: PropTypes.string,
  xs: PropTypes.number,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  saveDisabled: PropTypes.bool,
  ModalButton: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  ModalButtonTitle: PropTypes.string
}

export default memo(BasicModal)
