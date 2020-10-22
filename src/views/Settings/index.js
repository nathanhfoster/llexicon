import React, { useMemo, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import { Container, Row, Col, Button } from 'reactstrap'
import { BasicTabs, Header, PushNotifications } from '../../components'
import EntryStatistics from './EntryStatistics'
import ImportExportEntries from './ImportExportEntries'
import AccountDetails from './AccountDetails'
import UpdateProfile from './UpdateProfile'
import Storage from './Storage'
import Preferences from './Preferences'
import { RouterPush, RouteMap } from 'redux/router/actions'
import { UpdateAppVersion } from 'redux/Alerts/actions'
import './styles.css'

const {
  SETTINGS,
  SETTINGS_ENTRIES,
  SETTINGS_PREFERENCES,
  SETTINGS_PROFILE,
  SETTINGS_PUSH_NOTIFICATIONS,
  SETTINGS_STORAGE,
} = RouteMap

const mapStateToProps = ({
  Alerts: { serviceWorkerRegistration },
  App: { version },
  router: {
    location: { pathname },
  },
}) => ({ serviceWorkerRegistration, appVersion: version, pathname })

const mapDispatchToProps = { UpdateAppVersion }

const Settings = ({ serviceWorkerRegistration, appVersion, pathname, UpdateAppVersion }) => {
  if (pathname === SETTINGS) RouterPush(SETTINGS_ENTRIES)

  const appVerisionText = useMemo(
    () =>
      serviceWorkerRegistration
        ? `Update to app verision: ${appVersion}`
        : `App verision: ${appVersion}`,
    [serviceWorkerRegistration, appVersion],
  )
  const activeTab = pathname

  const handleTabChange = tabId => RouterPush(tabId)

  const handleUpdateApp = () => {}

  const tabs = [
    {
      tabId: SETTINGS_ENTRIES,
      title: 'Entries',

      className: 'mt-2',
      render: (
        <Fragment>
          <ImportExportEntries />
          <EntryStatistics />
        </Fragment>
      ),
      onClick: handleTabChange,
    },
    {
      tabId: SETTINGS_PROFILE,
      title: 'Profile',
      className: 'mt-2',
      render: (
        <Fragment>
          <AccountDetails />
          <UpdateProfile />
        </Fragment>
      ),
      onClick: handleTabChange,
    },
    {
      tabId: SETTINGS_PREFERENCES,
      title: 'Preferences',
      className: 'mt-2',
      render: <Preferences />,
      onClick: handleTabChange,
    },
    {
      tabId: SETTINGS_PUSH_NOTIFICATIONS,
      title: 'Push Notifications',
      className: 'mt-2',
      render: <PushNotifications />,
      onClick: handleTabChange,
    },
    {
      tabId: SETTINGS_STORAGE,
      title: 'Storage',
      className: 'mt-2',
      render: <Storage />,
      onClick: handleTabChange,
    },
  ]
  return (
    <Container className='Settings Container'>
      <Row>
        <Col xs={12} className='Center mt-3'>
          <Header>
            <i className='fa fa-cog mr-2' />
            SETTINGS
          </Header>
        </Col>
        <Col xs={12} className='Center'>
          {serviceWorkerRegistration ? (
            <Button>{appVerisionText}</Button>
          ) : (
            <h6>{appVerisionText}</h6>
          )}
        </Col>
      </Row>
      <Row>
        <Col xs={12} className='p-0'>
          <BasicTabs activeTab={activeTab} tabs={tabs} />
        </Col>
      </Row>
    </Container>
  )
}

Settings.propTypes = {
  serviceWorkerRegistration: PropTypes.object,
  appVersion: PropTypes.string,
  pathname: PropTypes.string.isRequired,
  UpdateAppVersion: PropTypes.func.isRequired,
}

export default reduxConnect(mapStateToProps, mapDispatchToProps)(Settings)
