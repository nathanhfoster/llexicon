import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { Toast, ToastHeader, ToastBody } from "reactstrap"
import { ClearAlerts } from "../../actions/Alerts"
import UseDebounce from "../../components/UseDebounce"
import "./styles.css"

const mapStateToProps = ({ Alerts: { title, message } }) => ({ title, message })

const mapDispatchToProps = { ClearAlerts }

export class AlertNotifications extends PureComponent {
  constructor(props) {
    super(props)
    this.interval = null

    const { message } = props
    this.state = { message }
  }

  static propTypes = {
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    ClearAlerts: PropTypes.func.isRequired
  }

  static defaultProps = { alertInterval: 3000 }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { title, message, alertInterval, ClearAlerts } = nextProps

    setTimeout(() => ClearAlerts(), alertInterval)

    const shouldShow = title && message ? true : false

    return { shouldShow, title, message }
  }

  componentWillUnmount() {
    const { ClearAlerts } = this.props
    ClearAlerts()
  }

  render() {
    const { ClearAlerts } = this.props
    const { shouldShow, title, message } = this.state

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
        <UseDebounce onChangeCallback={() => ClearAlerts()} />
        <ToastHeader icon={<i className="fas fa-feather-alt" />}>
          {title}
        </ToastHeader>
        <ToastBody>{message}</ToastBody>
      </Toast>
    )
  }
}

export default reduxConnect(
  mapStateToProps,
  mapDispatchToProps
)(AlertNotifications)
