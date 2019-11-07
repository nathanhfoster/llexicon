import React, { useState, useEffect, Fragment, memo } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap"
import { useAddToHomescreenPrompt } from "./prompt"
import getBrowserIcon from "./getBrowserIcon"

const { NODE_ENV } = process.env

const AddToHomeScreenModal = () => {
  const dispatch = useDispatch()
  const {
    isInStandalone,
    isOnMobileBrowser,
    navigator: { userAgent }
  } = useSelector(({ Window }) => Window)

  const [prompt, promptToInstall] = useAddToHomescreenPrompt()
  const [isVisible, setVisibleState] = useState(false)
  const [isDisabled, setDisabledState] = useState(true)

  const toggle = () => setVisibleState(!isVisible)

  const hide = () => setVisibleState(false)

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
    <Fragment>
      {!isInStandalone && (
        <Button color="success" onClick={toggle}>
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
    </Fragment>
  )
}

export default memo(AddToHomeScreenModal)
