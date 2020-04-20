import React, { useCallback } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { Toast, ToastHeader, ToastBody, Button } from "reactstrap"
import { UseDebounce } from ".."
import { ClearAlerts } from "../../redux/Alerts/actions"
import "./styles.css"

const mapStateToProps = ({
  Alerts: { title, message, timeout, serviceWorkerRegistration },
}) => ({
  title,
  message,
  timeout,
  serviceWorkerRegistration,
})

const mapDispatchToProps = { ClearAlerts }

const AlertNotifications = ({
  title,
  message,
  timeout,
  serviceWorkerRegistration,
  ClearAlerts,
}) => {
  const appUpdate = timeout === false
  const shouldShow = appUpdate || (title && message) ? true : false

  const handleClearAlerts = useCallback(() => {
    ClearAlerts()
  }, [])

  const handleUpdate = useCallback(() => {
    handleClearAlerts()
    setTimeout(() => {
      // const currentUrl = window.location.href
      // window.close()
      // window.open(currentUrl, "_blank")
      window.location.reload()
    }, 1000)
  }, [])

  return (
    <Toast
      className="Alert rounded"
      isOpen={shouldShow}
      appear={true}
      enter={true}
      exit={true}
      fade={true}
      transition={{
        mountOnEnter: true,
        unmountOnExit: true,
        timeout: 600,
      }}
    >
      <UseDebounce
        debounceOnMount={!appUpdate}
        onChangeCallback={handleClearAlerts}
        value={shouldShow}
        delay={timeout}
      />
      <ToastHeader icon={<i className="fas fa-feather-alt" />}>
        {title}
      </ToastHeader>
      <ToastBody>
        <h6>{message}</h6>

        {appUpdate && (
          <div className="Center">
            <Button onClick={handleUpdate} color="accent">
              Update
            </Button>
          </div>
        )}
      </ToastBody>
    </Toast>
  )
}

AlertNotifications.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  ClearAlerts: PropTypes.func.isRequired,
  timeout: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]).isRequired,
}

AlertNotifications.defaultProps = {}

export default reduxConnect(
  mapStateToProps,
  mapDispatchToProps
)(AlertNotifications)
