import React, { useState, memo, Fragment } from "react"
import PropTypes from "prop-types"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap"
import ToolbarButton from "../ToolbarButton"
import "./styles.css"

const ToolbarModal = ({
  modalTitle,
  onClickCallback,
  buttonIcon,
  buttonTitle,
  xs,
  children
}) => {
  const [modal, setModal] = useState(false)

  const toggle = () => setModal(!modal)

  return (
    <Fragment>
      <ToolbarButton
        xs={xs}
        onClickCallback={toggle}
        buttonIcon={buttonIcon}
        title={buttonTitle}
      />
      <Modal isOpen={modal} toggle={toggle} className="ToolbarModal" centered>
        <ModalHeader toggle={toggle} className="Center">
          {modalTitle}
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
        <ModalFooter className="Center">
          <Button
            color="primary"
            onClick={() => {
              onClickCallback()
              toggle()
            }}
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
  buttonIcon: PropTypes.string,
  buttonTitle: PropTypes.string,
  xs: PropTypes.number
}

export default memo(ToolbarModal)
