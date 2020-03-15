import React, { useState, useEffect, memo } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { Button } from "reactstrap"
import getBrowserIcon from "./getBrowserIcon"

const mapStateToProps = ({
  Window: {
    isInStandalone,
    isOnMobileBrowser,
    navigator: { userAgent }
  }
}) => ({ isInStandalone, isOnMobileBrowser, userAgent })

const mapDispatchToProps = {}

const AddToHomeScreenModal = ({
  width,
  isInStandalone,
  isOnMobileBrowser,
  userAgent,
  prompt,
  promptToInstall
}) => {
  const [isDisabled, setDisabledState] = useState(true)

  const styles = { width }

  useEffect(() => {
    if (prompt) {
      setDisabledState(false)
    }
  }, [prompt])

  const icon = getBrowserIcon(isOnMobileBrowser, userAgent)

  return (
    !isInStandalone && (
      <Button
        style={styles}
        color="success"
        onClick={promptToInstall}
        disabled={isDisabled}
      >
        {icon} Install
      </Button>
    )
  )
}

AddToHomeScreenModal.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isInStandalone: PropTypes.bool,
  isOnMobileBrowser: PropTypes.bool,
  userAgent: PropTypes.string,
  prompt: PropTypes.func,
  promptToInstall: PropTypes.func
}

AddToHomeScreenModal.defaultProps = {
  width: "auto"
}

export default memo(
  reduxConnect(mapStateToProps, mapDispatchToProps)(AddToHomeScreenModal)
)
