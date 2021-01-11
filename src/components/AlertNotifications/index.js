import React, { useCallback } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { Toast, ToastHeader, ToastBody, Button } from "reactstrap"
import { UseDebounce } from ".."
import { ClearAlerts, UpdateAppVersion } from "redux/Alerts/actions"
import "./styles.css"

const mapStateToProps = ({ Alerts: { title, message, timeout } }) => ({
  title,
  message,
  timeout,
})

const mapDispatchToProps = { ClearAlerts, UpdateAppVersion }

const AlertNotifications = ({
  icon,
  title,
  message,
  timeout,
  ClearAlerts,
  UpdateAppVersion,
}) => {
  const appUpdate = timeout === false
  const shouldShow = appUpdate || (title && message) ? true : false

  const handleClearAlerts = useCallback(() => {
    ClearAlerts()
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
        onChange={handleClearAlerts}
        value={shouldShow}
        delay={timeout}
      />
      <ToastHeader icon={icon}>{title}</ToastHeader>
      <ToastBody>
        <h6>{message}</h6>

        {appUpdate && (
          <div className="Center">
            <Button onClick={UpdateAppVersion} color="accent">
              Update
            </Button>
          </div>
        )}
      </ToastBody>
    </Toast>
  )
}

AlertNotifications.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  ClearAlerts: PropTypes.func.isRequired,
  UpdateAppVersion: PropTypes.func.isRequired,
  timeout: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]).isRequired,
}

AlertNotifications.defaultProps = {
  icon: <i className="fas fa-feather-alt" />,
  timeout: 3000,
}

export default connect(mapStateToProps, mapDispatchToProps)(AlertNotifications)
