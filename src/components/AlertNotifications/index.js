import React from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { Toast, ToastHeader, ToastBody, Button } from "reactstrap"
import { UseDebounce } from ".."
import { ClearAlerts } from "../../redux/Alerts/actions"
import { SetAppVersion } from "../../redux/App/actions"
import "./styles.css"

const mapStateToProps = ({ Alerts: { title, message } }) => ({ title, message })

const mapDispatchToProps = { ClearAlerts, SetAppVersion }

const AlertNotifications = ({
  title,
  message,
  alertInterval,
  ClearAlerts,
  SetAppVersion
}) => {
  const appUpdate = title === "App Update"
  const shouldShow = appUpdate || (title && message) ? true : false

  const debounceClear = () => {
    ClearAlerts()
  }

  const handleOnClickCallback = () => {
    SetAppVersion(new Date())
    debounceClear()
    setTimeout(() => window.location.reload(true), 1000)
  }

  return (
    <Toast
      className="Alert rounded"
      isOpen={shouldShow}
      appear={true}
      enter={true}
      exit={true}
      transition={{
        mountOnEnter: true,
        unmountOnExit: true,
        timeout: 600
      }}
    >
      <UseDebounce
        debounceOnMount={!appUpdate}
        onChangeCallback={debounceClear}
        value={shouldShow}
        delay={1600}
      />
      <ToastHeader icon={<i className="fas fa-feather-alt" />}>
        {title}
      </ToastHeader>
      <ToastBody>
        <h6>{message}</h6>

        {appUpdate && (
          <div className="Center">
            <Button onClick={handleOnClickCallback} color="accent">
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
  SetAppVersion: PropTypes.func.isRequired,
  alertInterval: PropTypes.number.isRequired
}

AlertNotifications.defaultProps = { alertInterval: 3000 }

export default reduxConnect(
  mapStateToProps,
  mapDispatchToProps
)(AlertNotifications)
