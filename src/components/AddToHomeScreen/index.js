import React, { useState, useEffect, memo } from "react"
import { connect as reduxConnect } from "react-redux"
import { Button } from "reactstrap"
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
  userAgent
}) => {
  const [prompt, promptToInstall] = useAddToHomescreenPrompt()
  const [isDisabled, setDisabledState] = useState(true)

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
    !isInStandalone && (
      <Button color="success" onClick={promptToInstall} disabled={isDisabled}>
        {icon} Install
      </Button>
    )
  )
}

export default memo(
  reduxConnect(mapStateToProps, mapDispatchToProps)(AddToHomeScreenModal)
)
