import React, { useState, useEffect, Fragment, memo } from "react"
import { connect as reduxConnect } from "react-redux"
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap"
import { useAddToHomescreenPrompt } from "./prompt"
import getBrowserIcon from "./getBrowserIcon"
import "./styles.css"
const { NODE_ENV } = process.env

const mapStateToProps = ({
  Window: {
    isInStandalone,
    isOnMobileBrowser,
    navigator: { userAgent }
  }
}) => ({ isInStandalone, isOnMobileBrowser, userAgent })

const mapDispatchToProps = {}

const AddToHomeScreenModal = ({
  isInStandalone,
  isOnMobileBrowser,
  userAgent,
  onClickCallback
}) => {
  const [prompt, promptToInstall] = useAddToHomescreenPrompt()
  const [isVisible, setVisibleState] = useState(false)
  const [isDisabled, setDisabledState] = useState(true)

  const toggle = () => {
    if (onClickCallback) onClickCallback()
    setVisibleState(!isVisible)
  }

  const hide = () => {
    if (onClickCallback) onClickCallback()
    setVisibleState(false)
  }

  const isInProduction = NODE_ENV !== "development"
  const canInstallOnMobile = !isInStandalone && isOnMobileBrowser
  const canInstallOnDesktop = !isInStandalone && !isOnMobileBrowser
  const canInstall =
    isInProduction && (canInstallOnMobile || canInstallOnDesktop)

  useEffect(() => {
    if (canInstall || prompt) {
      setDisabledState(false)
    }
  }, [prompt])

  const icon = getBrowserIcon(isOnMobileBrowser, userAgent)

  return (
    <div>
      {!isInStandalone && (
        <Button
          tag="div"
          color="success"
          className="InstallButton"
          onClick={toggle}
          disabled={isDisabled}
        >
          {icon} Install
        </Button>
      )}
      <Modal isOpen={isVisible} toggle={toggle} className="ConfirmActionModal">
        <ModalHeader toggle={toggle} className="Center">
          Installation
        </ModalHeader>
        <ModalBody>
          Would you like to install this app? Doing so will allow the following
          features:
          <li>Native App Interface</li>
          <li>Offline Use</li>
        </ModalBody>
        <ModalFooter className="Center">
          <Button
            color="success"
            onClick={() => {
              promptToInstall()
              hide()
            }}
            disabled={isDisabled}
          >
            {icon} Install
          </Button>
          <Button color="primary" onClick={hide}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default memo(
  reduxConnect(mapStateToProps, mapDispatchToProps)(AddToHomeScreenModal)
)
