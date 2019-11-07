import React, { useState, useEffect } from "react"
import { Button } from "reactstrap"
import { useAddToHomescreenPrompt } from "../prompt"
const { NODE_ENV } = process.env

const getBrowserIcon = (isOnMobileBrowser, browserUserAgent) => {
  if (!isOnMobileBrowser) {
    if (browserUserAgent.includes("Chrome")) {
      return <i className="fab fa-chrome" />
    }
    if (browserUserAgent.includes("Firefox")) {
      return <i className="fab fa-firefox" />
    }
    if (browserUserAgent.includes("Safari")) {
      return <i className="fab fa-safari" />
    }
    if (browserUserAgent.includes("Edge")) {
      return <i className="fab fa-edge" />
    }
    if (browserUserAgent.includes("Explorer")) {
      return <i className="fab fa-internet-explorer" />
    }
  } else {
    if (browserUserAgent.includes("Android")) {
      return <i className="fab fa-android" />
    }
    if (browserUserAgent.includes("Android")) {
      return <i className="fab fa-android" />
    }
    if (browserUserAgent.includes("iP")) {
      return <i className="fab fa-apple" />
    }
    if (browserUserAgent.includes("Windows")) {
      return <i className="fab fa-windows" />
    }
  }
}

const AddToHomeScreenButton = ({
  isInStandalone,
  isOnMobileBrowser,
  browserUserAgent
}) => {
  const [prompt, promptToInstall] = useAddToHomescreenPrompt()
  const [isDisabled, setDisabledState] = useState(true)

  useEffect(() => {
    const canInstall = NODE_ENV !== "development" && !isInStandalone
    if (canInstall || prompt) {
      setDisabledState(false)
    }
  }, [prompt])

  const icon = getBrowserIcon(isOnMobileBrowser, browserUserAgent)

  return (
    !isDisabled && (
      <Button color="success" onClick={promptToInstall} disabled={isDisabled}>
        {icon} Install
      </Button>
    )
  )
}

export default AddToHomeScreenButton
