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
  footer,
  saveButton,
  cancelButton,
  size,
}) => {
  const [isOpen, setIsOpen] = useState(false)

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
      {button === false ? null : typeof button === "string" ? (
        <Button
          color="primary"
          disabled={disabled}
          onClick={() => {
            onClickCallback && onClickCallback()
            toggle()
          }}
        >
          {button}
        </Button>
      ) : (
        cloneElement(button, {
          ...button.props,
          disabled,
          onClick: () => {
            const { onClick } = button.props
            onClick && onClick()
            onClickCallback && onClickCallback()
            toggle()
          },
          onClickCallback: () => {
            onClickCallback && onClickCallback()
            toggle()
          },
        })
      )}
      <Modal
        isOpen={shouldShowModal}
        toggle={toggle}
        className="BasicModal"
        size={size}
        centered
        onClosed={onCancelCallback}
      >
        <ModalHeader
          toggle={toggle}
          style={{
            justifyContent:
              typeof title === "string" ? "center" : "space-between",
          }}
        >
          {title}
        </ModalHeader>
        <ModalBody className={className}>{children}</ModalBody>
        <ModalFooter style={{ justifyContent: "center" }}>
          {footer || (
            <Fragment>
              {cloneElement(saveButton, {
                disabled: disabledSave,
                onClick: handleSave,
              })}
              {cloneElement(cancelButton, { onClick: handleClose })}
            </Fragment>
          )}
        </ModalFooter>
      </Modal>
    </Fragment>
  )
}

BasicModal.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onClickCallback: PropTypes.func,
  onSaveCallback: PropTypes.func,
  onCancelCallback: PropTypes.func,
  xs: PropTypes.number,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  disabledSave: PropTypes.bool,
  button: PropTypes.oneOfType([PropTypes.node, PropTypes.func, PropTypes.bool]),
  footer: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),

  // reasctrap Modal Props https://reactstrap.github.io/components/modals/
  // boolean to control the state of the popover
  isOpen: PropTypes.bool,
  autoFocus: PropTypes.bool,
  // if modal should be centered vertically in viewport
  centered: PropTypes.bool,
  // corresponds to bootstrap's modal sizes, ie. 'lg' or 'sm'
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
  // callback for toggling isOpen in the controlling component
  toggle: PropTypes.func,
  role: PropTypes.string, // defaults to "dialog"
  // used to reference the ID of the title element in the modal
  labelledBy: PropTypes.string,
  keyboard: PropTypes.bool,
  // control backdrop, see https://v4-alpha.getbootstrap.com/components/modal/#options
  backdrop: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(["static"])]),
  // if body of modal should be scrollable when content is long
  scrollable: PropTypes.bool,
  // allows for a node/component to exist next to the modal (outside of it). Useful for external close buttons
  // external: PropTypes.node,
  // called on componentDidMount
  onEnter: PropTypes.func,
  // called on componentWillUnmount
  onExit: PropTypes.func,
  // called when done transitioning in
  onOpened: PropTypes.func,
  // called when done transitioning out
  onClosed: PropTypes.func,
  className: PropTypes.string,
  wrapClassName: PropTypes.string,
  modalClassName: PropTypes.string,
  backdropClassName: PropTypes.string,
  contentClassName: PropTypes.string,
  // boolean to control whether the fade transition occurs (default: true)
  fade: PropTypes.bool,
  cssModule: PropTypes.object,
  // zIndex defaults to 1000.
  zIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  // backdropTransition - controls backdrop transition
  // timeout is 150ms by default to match bootstrap
  // see Fade for more details
  backdropTransition: PropTypes.object,
  // modalTransition - controls modal transition
  // timeout is 300ms by default to match bootstrap
  // see Fade for more details
  modalTransition: PropTypes.object,
  innerRef: PropTypes.object,
  // if modal should be destructed/removed from DOM after closing
  unmountOnClose: PropTypes.bool, // defaults to true
  // if the element which triggered the modal to open should focused after the modal closes (see example somewhere below)
  returnFocusAfterClose: PropTypes.bool, // defaults to true
}

BasicModal.defaultProps = {
  cancelButton: <Button color="danger">Cancel</Button>,
  saveButton: (
    <Button className="mr-1" color="success">
      Save
    </Button>
  ),
  disabled: false,
  disabledSave: false,
  size: "lg",
}

export default memo(BasicModal)
