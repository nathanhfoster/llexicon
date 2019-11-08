import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { Toast, ToastHeader, ToastBody } from "reactstrap"
import { ClearAlerts } from "../../actions/Alerts"
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

  static defaultProps = { alertInterval: 2500 }

  componentWillMount() {
    this.getState(this.props)
  }

  componentWillReceiveProps(nextProps) {
    clearInterval(this.interval)
    this.getState(nextProps)
  }

  getState = props => {
    const { title, message, alertInterval, ClearAlerts } = props

    //this.interval = setInterval(() => ClearAlerts(), alertInterval)
    setTimeout(() => ClearAlerts(), alertInterval)

    const shouldShow = title && message ? true : false

    this.setState({ shouldShow, title, message })
  }

  componentWillUnmount() {
    clearInterval(this.interval)
    const { ClearAlerts } = this.props
    ClearAlerts()
  }

  render() {
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
          timeout: 400
        }}
      >
        <ToastHeader
          icon={
            <i
              className="fas fa-feather-alt"
              style={{ fontSize: 18, color: "var(--primaryColor)" }}
            />
          }
        >
          {title}
        </ToastHeader>
        <ToastBody>{message}</ToastBody>
      </Toast>
    )
  }
}

export default reduxConnect(mapStateToProps, mapDispatchToProps)(
  AlertNotifications
)
