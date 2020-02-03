import React, { useState, memo, Fragment, cloneElement } from "react"
import PropTypes from "prop-types"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap"
import "./styles.css"

const BasicModal = ({
  title,
  onClickCallback,
  onSaveCallback,
  onCancelCallback,
  children,
  className,
  disabled,
  saveDisabled,
  button,
  buttonTitle,
  footer
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen(!isOpen)

  return (
    <Fragment>
      {button ? (
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
        isOpen={isOpen}
        toggle={toggle}
        className="BasicModal"
        size="lg"
        centered
        onClosed={onCancelCallback}
      >
        <ModalHeader toggle={toggle} className="Center">
          {title}
        </ModalHeader>
        <ModalBody className={className}>{children}</ModalBody>
        <ModalFooter className="Center">
          {footer || (
            <Fragment>
              <Button
                className="mr-1"
                color="primary"
                onClick={() => {
                  onSaveCallback && onSaveCallback()
                  toggle()
                }}
                disabled={saveDisabled}
              >
                Save
              </Button>
              <Button color="danger" onClick={toggle}>
                Cancel
              </Button>
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
  ButtonIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  buttonTitle: PropTypes.string,
  xs: PropTypes.number,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  saveDisabled: PropTypes.bool,
  button: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  buttonTitle: PropTypes.string,
  footer: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
}

BasicModal.defaultProps = {
  disabled: false,
  saveDisabled: false
}

export default memo(BasicModal)
