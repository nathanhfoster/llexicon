import React, { useState, memo, Fragment } from "react"
import PropTypes from "prop-types"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap"
import ToolbarButton from "../ToolbarButton"
import "./styles.css"

const ToolbarModal = ({
  modalTitle,
  onClickCallback,
  onSaveCallback,
  onCancelCallback,
  buttonIcon,
  buttonTitle,
  xs,
  children,
  className,
  disabled = false,
  saveDisabled = false,
  Component
}) => {
  const [modal, setModal] = useState(false)

  const toggle = () => setModal(!modal)

  return (
    <Fragment>
      <ToolbarButton
        xs={xs}
        onClickCallback={() => {
          if (onClickCallback) onClickCallback()
          toggle()
        }}
        buttonIcon={buttonIcon}
        title={buttonTitle}
        disabled={disabled}
      >
        {Component && <Component />}
      </ToolbarButton>

      <Modal
        isOpen={modal}
        toggle={toggle}
        className="ToolbarModal"
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
              onSaveCallback()
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

ToolbarModal.propTypes = {
  modalTitle: PropTypes.string,
  onClickCallback: PropTypes.func,
  onSaveCallback: PropTypes.func,
  onCancelCallback: PropTypes.func,
  buttonIcon: PropTypes.string,
  buttonTitle: PropTypes.string,
  xs: PropTypes.number,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  saveDisabled: PropTypes.bool
}

export default memo(ToolbarModal)
