import React, { useState, useEffect, memo } from "react"
import { connect as reduxConnect } from "react-redux"
import { Button } from "reactstrap"
import getBrowserIcon from "./getBrowserIcon"
import "./styles.css"

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
  prompt,
  promptToInstall
}) => {
  const [isDisabled, setDisabledState] = useState(true)

  useEffect(() => {
    if (prompt) {
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
