import React, { Fragment, memo } from "react"
import PropTypes from "prop-types"
import { withRouter } from "react-router-dom"
import { BasicTabs, Header } from "../../components"
import EntryStatistics from "./EntryStatistics"
import { RouterPush, RouteMap } from "../../routes"
import { Container, Row, Col } from "reactstrap"
import ImportExportEntries from "./ImportExportEntries"
import AccountDetails from "./AccountDetails"
import UpdateProfile from "./UpdateProfile"
import Sections from "./Sections"
import "./styles.css"

const {
  SETTINGS,
  SETTINGS_ENTRIES,
  SETTINGS_PREFERENCES,
  SETTINGS_PROFILE
} = RouteMap

const Settings = ({ history, location: { pathname } }) => {
  if (pathname === SETTINGS) RouterPush(history, SETTINGS_ENTRIES)
  const activeTab = pathname

  const handleTabChange = tabId => RouterPush(history, tabId)

  const tabs = [
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
      onClickCallback: handleTabChange
    },
    {
      tabId: SETTINGS_PREFERENCES,
      title: "Preferences",
      className: "mt-2",
      render: <Sections />,
      onClickCallback: handleTabChange
    },
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
      onClickCallback: handleTabChange
    }
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
  User: PropTypes.object.isRequired
}

export default withRouter(memo(Settings))
