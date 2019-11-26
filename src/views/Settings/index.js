import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import ImportEntries from "../../components/ImportEntries"
import {
  Container,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Tooltip
} from "reactstrap"
import {
  GetUserSettings,
  PostSettings,
  SetSettings
} from "../../actions/Settings"
import "./styles.css"

const mapStateToProps = ({ User }) => ({ User })

const mapDispatchToProps = { GetUserSettings, PostSettings, SetSettings }

class Settings extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      ShowFooterTooltip: false,
      ShowPushMessagesTooltip: false,
      ShowOfflineModeTooltip: false
    }
  }

  static propTypes = {
    Settings: PropTypes.object,
    ShowFooterTooltip: PropTypes.bool,
    ShowPushMessagesTooltip: PropTypes.bool,
    ShowOfflineModeTooltip: PropTypes.bool,
    GetUserSettings: PropTypes.func.isRequired,
    PostSettings: PropTypes.func.isRequired,
    SetSettings: PropTypes.func.isRequired
  }

  static defaultProps = {}

  static getDerivedStateFromProps(nextProps, prevState) {
    return nextProps
  }

  componentDidMount() {
    const { User, GetUserSettings } = this.props
    if (User.token) GetUserSettings()
  }

  toggleTooltip = e =>
    this.setState({ [e.target.id]: !this.state[e.target.id] })

  handleOnClick = settingId => {
    const {
      User: { id, token, Settings },
      PostSettings,
      SetSettings
    } = this.props

    const value = Settings[settingId]

    !Settings.id
      ? PostSettings({
          user: id,
          [settingId]: !value
        })
      : SetSettings({
          [settingId]: !value
        })
  }

  render() {
    const {
      User,
      ShowFooterTooltip,
      ShowPushMessagesTooltip,
      ShowOfflineModeTooltip
    } = this.state
    const { Settings } = User
    const { show_footer, push_messages, offline_mode } = Settings

    return (
      <Container className="Settings Container">
        <Row>
          <Col xs={12}>
            <h1 className="pageHeader">SETTINGS</h1>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <ImportEntries />
          </Col>
        </Row>
        <Row>
          <h2 className="headerBanner">Appearance</h2>
        </Row>
        <Row className="checkBoxTable">
          <Col xs={12}>
            <FormGroup check>
              <Label check>
                <Input
                  readOnly
                  type="radio"
                  disabled={!User.id}
                  checked={show_footer}
                  onClick={() => this.handleOnClick("show_footer")}
                />
                <span className="checkBoxText" id="ShowFooterTooltip">
                  Show footer
                </span>
                <Tooltip
                  placement="right"
                  isOpen={ShowFooterTooltip}
                  target="ShowFooterTooltip"
                  toggle={this.toggleTooltip}
                >
                  Toggles the view of the footer
                </Tooltip>
              </Label>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <h2 className="headerBanner">Features</h2>
        </Row>
        <Row className="checkBoxTable">
          <Col xs={12}>
            <FormGroup check>
              <Label check>
                <Input
                  readOnly
                  type="radio"
                  disabled={!User.id}
                  checked={offline_mode}
                  onClick={() => this.handleOnClick("offline_mode")}
                />
                <span className="checkBoxText" id="ShowOfflineModeTooltip">
                  Offline mode
                </span>
                <Tooltip
                  placement="right"
                  isOpen={ShowOfflineModeTooltip}
                  target="ShowOfflineModeTooltip"
                  toggle={this.toggleTooltip}
                >
                  Toggles frequent fetches of messages
                </Tooltip>
              </Label>
            </FormGroup>
          </Col>
        </Row>
        <Row className="checkBoxTable">
          <Col xs={12}>
            <FormGroup check>
              <Label check>
                <Input
                  readOnly
                  type="radio"
                  disabled={!User.id}
                  checked={push_messages}
                  onClick={() => this.handleOnClick("push_messages")}
                />
                <span className="checkBoxText" id="ShowPushMessagesTooltip">
                  Push messages
                </span>
                <Tooltip
                  placement="right"
                  isOpen={ShowPushMessagesTooltip}
                  target="ShowPushMessagesTooltip"
                  toggle={this.toggleTooltip}
                >
                  Toggles frequent fetches of messages
                </Tooltip>
              </Label>
            </FormGroup>
          </Col>
        </Row>
      </Container>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Settings)
