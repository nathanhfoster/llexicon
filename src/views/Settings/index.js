import React, { useEffect, useMemo } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { ImportEntries, EntryStatistics } from "../../components"
import { Container, Row, Col, Button, Form, FormGroup, Media } from "reactstrap"
import UpdateProfile from "./UpdateProfile"
import SettingInput from "./SettingInput"

import {
  GetUserSettings,
  PostSettings,
  SetSettings
} from "../../redux/User/actions"
import { copyStringToClipboard } from "../../helpers"
import MomentJs from "moment"

import Moment from "react-moment"
import "./styles.css"

const mapStateToProps = ({ User, Entries: { items, filteredItems } }) => ({
  User,
  items,
  filteredItems
})

const mapDispatchToProps = {
  GetUserSettings,
  PostSettings,
  SetSettings
}

const Settings = ({
  User,
  items,
  filteredItems,
  GetUserSettings,
  PostSettings,
  SetSettings
}) => {
  const entries = items.concat(filteredItems)

  useEffect(() => {
    if (User.token) GetUserSettings()
  }, [])

  const {
    Settings: { show_footer, offline_mode, push_messages }
  } = User

  const handleOnClick = settingKey => {
    const { id, token, Settings } = User

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

  const sections = [
    {
      title: (
        <span>
          Appearance <i className="fas fa-user-astronaut" />
        </span>
      ),
      inputs: [
        {
          settingKey: "show_footer",
          disabled: !User.id,
          checked: show_footer,
          onClickCallback: handleOnClick,
          title: "Show footer",
          tooltipTitle: "Toggles the view of the footer"
        }
      ]
    },
    {
      title: (
        <span>
          Features <i className="fas fa-space-shuttle" />
        </span>
      ),
      inputs: [
        {
          settingKey: "offline_mode",
          disabled: !User.id,
          checked: offline_mode,
          onClickCallback: handleOnClick,
          title: "Offline mode",
          tooltipTitle: "Disconnect from the stars"
        },
        {
          settingKey: "push_messages",
          disabled: !User.id,
          checked: push_messages,
          onClickCallback: handleOnClick,
          title: "Push Messages",
          tooltipTitle: "Toggles frequent fetches of messages"
        }
      ]
    }
  ]

  const renderInputs = inputs =>
    inputs.map(input => <SettingInput key={input.settingKey} {...input} />)

  const renderSections = useMemo(
    () =>
      sections.map((section, i) => {
        const { title, inputs } = section
        return (
          <Col xs={12} key={i}>
            <FormGroup tag="fieldset">
              <legend className="headerBanner">{title}</legend>
              {renderInputs(inputs)}
            </FormGroup>
          </Col>
        )
      }),
    [sections]
  )

  const handleExportEntries = () => {
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

  return (
    <Container className="Settings Container">
      <Row>
        <Col xs={12}>
          <h1 className="pageHeader Center">
            <i className="fa fa-cog mr-2" />
            SETTINGS
          </h1>
        </Col>
      </Row>

      <Row>
        <Col xs={6}>
          <ImportEntries />
        </Col>
        <Col xs={6}>
          <Button color="primary" onClick={handleExportEntries}>
            <i className="fas fa-clipboard" /> Export Entries
          </Button>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          tag="h3"
          style={{ display: "flex", alignContent: "center" }}
        >
          {User.picture && (
            <Media middle src={User.picture} height={52} className="mr-2" />
          )}
          {`${User.first_name} ${User.last_name}`}
        </Col>
        <Col xs={12}>
          <span>Joined </span>
          <Moment fromNow>{User.date_joined}</Moment>
          <span> on </span>
          <Moment format="MMMM DD, YYYY hh:mma">{User.date_joined}</Moment>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <UpdateProfile />
        </Col>
      </Row>
      <Row>
        <Form>{renderSections}</Form>
      </Row>
      <Row>
        <Col xs={12}>
          <EntryStatistics items={items} filteredItems={filteredItems} />
        </Col>
      </Row>
    </Container>
  )
}

Settings.propTypes = {
  User: PropTypes.object.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  filteredItems: PropTypes.arrayOf(PropTypes.object).isRequired,
  GetUserSettings: PropTypes.func.isRequired,
  PostSettings: PropTypes.func.isRequired,
  SetSettings: PropTypes.func.isRequired
}

export default reduxConnect(mapStateToProps, mapDispatchToProps)(Settings)
