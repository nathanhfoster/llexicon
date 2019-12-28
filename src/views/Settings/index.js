import React, { PureComponent, Fragment } from "react"
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
import SettingInput from "./SettingInput"
import "./styles.css"

const handleOnClick = (settingKey, props) => {
  const {
    User: { id, token, Settings },
    PostSettings,
    SetSettings
  } = props

  const value = Settings[settingKey]

  !Settings.id
    ? PostSettings({
        user: id,
        [settingKey]: !value
      })
    : SetSettings({
        [settingKey]: !value
      })
}

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
      ShowContainerWidthTooltip: false,
      ShowPushMessagesTooltip: false,
      ShowOfflineModeTooltip: false
    }
  }

  static propTypes = {
    Settings: PropTypes.object,
    ShowFooterTooltip: PropTypes.bool,
    ShowContainerWidthTooltip: PropTypes.bool,
    ShowPushMessagesTooltip: PropTypes.bool,
    ShowOfflineModeTooltip: PropTypes.bool,
    UpdateUser: PropTypes.func.isRequired,
    GetUserSettings: PropTypes.func.isRequired,
    PostSettings: PropTypes.func.isRequired,
    SetSettings: PropTypes.func.isRequired
  }

  static defaultProps = {}

  static getDerivedStateFromProps(nextProps, prevState) {
    const { User } = nextProps
    const {
      Settings: {
        show_footer,
        full_container_width,
        offline_mode,
        push_messages
      }
    } = User
    const sections = [
      {
        title: "Appearance",
        inputs: [
          {
            settingKey: "show_footer",
            disabled: !User.id,
            checked: show_footer,
            onClickCallback: key => handleOnClick(key, nextProps),
            title: "Show footer",
            tooltipTitle: "Toggles the view of the footer"
          },
          {
            settingKey: "full_container_width",
            disabled: !User.id,
            checked: full_container_width,
            onClickCallback: key => handleOnClick(key, nextProps),
            title: "Full container width",
            tooltipTitle:
              "Toggles containers from being 100% the width of the screen or with padding"
          }
        ]
      },
      {
        title: "Features",
        inputs: [
          {
            settingKey: "offline_mode",
            disabled: !User.id,
            checked: offline_mode,
            onClickCallback: key => handleOnClick(key, nextProps),
            title: "Offline mode",
            tooltipTitle: "Toggles frequent fetches of messages"
          },
          {
            settingKey: "push_messages",
            disabled: !User.id,
            checked: push_messages,
            onClickCallback: key => handleOnClick(key, nextProps),
            title: "Push Messages",
            tooltipTitle: "Toggles frequent fetches of messages"
          }
        ]
      }
    ]
    return { User, sections }
  }

  componentDidMount() {
    const { User, GetUserSettings } = this.props
    if (User.token) GetUserSettings()
  }

  renderInputs = inputs =>
    inputs.map(input => <SettingInput key={input.settingKey} {...input} />)

  renderSections = sections =>
    sections.map((section, i) => {
      const { title, inputs } = section
      return (
        <Fragment key={i}>
          <Row>
            <h2 className="headerBanner">{title}</h2>
          </Row>
          {this.renderInputs(inputs)}
        </Fragment>
      )
    })

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
    const { User, sections } = this.state

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

        {this.renderSections(sections)}
      </Container>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Settings)
