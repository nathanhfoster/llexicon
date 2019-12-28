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
  Tooltip,
  Button
} from "reactstrap"
import { UpdateUser } from "../../actions/User"
import {
  GetUserSettings,
  PostSettings,
  SetSettings
} from "../../actions/Settings"
import { copyStringToClipboard } from "../../helpers"
import MomentJs from "moment"
import BasicForm from "../../components/BasicForm"
import "./styles.css"

const mapStateToProps = ({ User, Entries }) => ({
  User,
  entries: Entries.items
})

const mapDispatchToProps = {
  UpdateUser,
  GetUserSettings,
  PostSettings,
  SetSettings
}

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
    UpdateUser: PropTypes.func.isRequired,
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

  handleExportEntries = () => {
    const { entries } = this.state

    const formattedEntries = entries.map((entry, i) => {
      const {
        id,
        author,
        tags,
        title,
        html,
        date_created,
        date_created_by_author,
        date_updated,
        views,
        latitude,
        longitude
      } = entry
      const dateFormat = "YYYY-MM-DD hh:mm:ss"

      return {
        id,
        author,
        tags: tags.reduce(
          (entryString, entry) => (entryString += `${entry.title},`),
          ""
        ),
        title,
        html,
        date_created: MomentJs(date_created).format(dateFormat),
        date_created_by_author: MomentJs(date_created_by_author).format(
          dateFormat
        ),
        date_updated: MomentJs(date_updated).format(dateFormat),
        views,
        latitude,
        longitude
      }
    })
    copyStringToClipboard(JSON.stringify(formattedEntries))
    alert("Entries copied to clipboard.")
  }

  handleChangeUser = payload => {
    const { UpdateUser } = this.props

    UpdateUser(payload)
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
          <Col xs={6}>
            <ImportEntries />
          </Col>
          <Col xs={6}>
            <Button color="primary" onClick={this.handleExportEntries}>
              <i className="fas fa-clipboard" /> Export Entries
            </Button>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <BasicForm
              title="Update Profile"
              onSubmit={payload => this.handleChangeUser(payload)}
              submitLabel="Update"
              inputs={[
                {
                  label: "Username",
                  type: "text",
                  name: "username",
                  id: "username",
                  placeholder: "Username...",
                  defaultValue: User.username
                },
                {
                  label: "email",
                  type: "email",
                  name: "email",
                  id: "email",
                  placeholder: "Email...",
                  defaultValue: User.email
                },
                {
                  label: "First name",
                  type: "text",
                  name: "first_name",
                  id: "first_name",
                  placeholder: "First Name...",
                  defaultValue: User.first_name
                },
                {
                  label: "Last name",
                  type: "text",
                  name: "last_name",
                  id: "last_name",
                  placeholder: "Last name...",
                  defaultValue: User.last_name
                },
                {
                  label: "Password",
                  type: "password",
                  name: "password",
                  id: "password",
                  placeholder: "Password..."
                }
                // {
                //   label: "Opt in",
                //   type: "radio",
                //   name: "opt_in",
                //   id: "opt_in",
                //   placeholder: "Opt in?"
                // }
              ]}
            />
          </Col>
        </Row>

        <Row>
          <h2 className="headerBanner">Appearance</h2>
        </Row>
        <Row tag={FormGroup} check className="checkBoxTable">
          <Col tag={Label} check xs={12}>
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
          </Col>
        </Row>
        <Row>
          <h2 className="headerBanner">Features</h2>
        </Row>
        <Row tag={FormGroup} check className="checkBoxTable">
          <Col tag={Label} check xs={12}>
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
          </Col>
        </Row>
        <Row tag={FormGroup} check className="checkBoxTable">
          <Col tag={Label} check xs={12}>
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
          </Col>
        </Row>
      </Container>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Settings)
