import React, { Fragment, memo } from "react"
import PropTypes from "prop-types"
import { UserProps } from "../../redux/User/propTypes"
import { withRouter } from "react-router-dom"
import { Container, Row, Col } from "reactstrap"
import { BasicTabs, Header, PushNotifications } from "../../components"
import EntryStatistics from "./EntryStatistics"
import ImportExportEntries from "./ImportExportEntries"
import AccountDetails from "./AccountDetails"
import UpdateProfile from "./UpdateProfile"
import Storage from "./Storage"
import Sections from "./Sections"
import { RouterPush, RouteMap } from "../../routes"
import "./styles.css"

const {
  SETTINGS,
  SETTINGS_ENTRIES,
  SETTINGS_PREFERENCES,
  SETTINGS_PROFILE,
  SETTINGS_PUSH_NOTIFICATIONS,
  SETTINGS_STORAGE,
} = RouteMap

const Settings = ({ history, location: { pathname } }) => {
  if (pathname === SETTINGS) RouterPush(history, SETTINGS_ENTRIES)
  const activeTab = pathname

  const handleTabChange = (tabId) => RouterPush(history, tabId)

  const tabs = [
    {
      tabId: SETTINGS_ENTRIES,
      title: "Entries",

      className: "mt-2",
      render: (
        <Fragment>
          <ImportExportEntries />
          <EntryStatistics />
        </Fragment>
      ),
      onClickCallback: handleTabChange,
    },
    {
      tabId: SETTINGS_PROFILE,
      title: "Profile",
      className: "mt-2",
      render: (
        <Fragment>
          <AccountDetails />
          <UpdateProfile />
        </Fragment>
      ),
      onClickCallback: handleTabChange,
    },
    {
      tabId: SETTINGS_PREFERENCES,
      title: "Preferences",
      className: "mt-2",
      render: <Sections />,
      onClickCallback: handleTabChange,
    },
    {
      tabId: SETTINGS_PUSH_NOTIFICATIONS,
      title: "Push Notifications",
      className: "mt-2",
      render: <PushNotifications />,
      onClickCallback: handleTabChange,
    },
    {
      tabId: SETTINGS_STORAGE,
      title: "Storage",
      className: "mt-2",
      render: <Storage />,
      onClickCallback: handleTabChange,
    },
  ]
  return (
    <Container className="Settings Container">
      <Row>
        <Col xs={12} className="Center mt-3">
          <Header>
            <i className="fa fa-cog mr-2" />
            SETTINGS
          </Header>
        </Col>
      </Row>
      <Row>
        <Col xs={12} className="p-0">
          <BasicTabs activeTab={activeTab} tabs={tabs} />
        </Col>
      </Row>
    </Container>
  )
}

Settings.propTypes = {
  User: UserProps,
}

export default withRouter(memo(Settings))
