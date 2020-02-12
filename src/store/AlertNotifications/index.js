import React from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { Toast, ToastHeader, ToastBody } from "reactstrap"
import { UseDebounce } from "../../components"
import { ClearAlerts } from "../../actions/Alerts"
import "./styles.css"

const mapStateToProps = ({ Alerts: { title, message } }) => ({ title, message })

const mapDispatchToProps = { ClearAlerts }

const AlertNotifications = ({ title, message, alertInterval, ClearAlerts }) => {
  const shouldShow = title && message ? true : false

  const debounceClear = setTimeout(() => ClearAlerts(), alertInterval)

  return (
    <Toast
      className="Alert"
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
        onChangeCallback={debounceClear}
        value={shouldShow}
        delay={1600}
      />
      <ToastHeader icon={<i className="fas fa-feather-alt" />}>
        {title}
      </ToastHeader>
      <ToastBody>{message}</ToastBody>
    </Toast>
  )
}

AlertNotifications.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  ClearAlerts: PropTypes.func.isRequired,
  alertInterval: PropTypes.number.isRequired
}

AlertNotifications.defaultProps = { alertInterval: 3000 }

export default reduxConnect(
  mapStateToProps,
  mapDispatchToProps
)(AlertNotifications)
