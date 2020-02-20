import React, { useEffect, useMemo } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { Form, FormGroup } from "reactstrap"
import SettingInput from "./SettingInput"

import {
  GetUserSettings,
  PostSettings,
  SetSettings
} from "../../../redux/User/actions"

const mapStateToProps = ({ User }) => ({
  User
})

const mapDispatchToProps = {
  GetUserSettings,
  PostSettings,
  SetSettings
}

const Sections = ({ User, GetUserSettings, PostSettings, SetSettings }) => {
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
          <FormGroup key={i} tag="fieldset">
            <legend className="headerBanner">{title}</legend>
            {renderInputs(inputs)}
          </FormGroup>
        )
      }),
    [sections]
  )

  return <Form>{renderSections}</Form>
}

Sections.propTypes = {
  User: PropTypes.object.isRequired,
  GetUserSettings: PropTypes.func.isRequired,
  PostSettings: PropTypes.func.isRequired,
  SetSettings: PropTypes.func.isRequired
}

export default reduxConnect(mapStateToProps, mapDispatchToProps)(Sections)
