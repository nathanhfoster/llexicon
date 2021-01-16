import React, { useMemo, useCallback, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useLocation } from 'react-router-dom'
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

const mapStateToProps = ({ Alerts: { serviceWorkerRegistration }, App: { version } }) => ({
  serviceWorkerRegistration,
  appVersion: version,
})

const mapDispatchToProps = { UpdateAppVersion }

const Settings = ({ serviceWorkerRegistration, appVersion, UpdateAppVersion }) => {
  const { pathname } = useLocation()
  if (pathname === SETTINGS) RouterPush(SETTINGS_ENTRIES)

  const appVerisionText = useMemo(
    () =>
      serviceWorkerRegistration
        ? `Update to app verision: ${appVersion}`
        : `App verision: ${appVersion}`,
    [serviceWorkerRegistration, appVersion],
  )
  const activeTab = pathname

  const handleTabChange = useCallback(tabId => RouterPush(tabId), [])

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
    },
    {
      tabId: SETTINGS_PREFERENCES,
      title: 'Preferences',
      className: 'mt-2',
      render: <Preferences />,
    },
    {
      tabId: SETTINGS_PUSH_NOTIFICATIONS,
      title: 'Push Notifications',
      className: 'mt-2',
      render: <PushNotifications />,
      width: 180,
    },
    {
      tabId: SETTINGS_STORAGE,
      title: 'Storage',
      className: 'mt-2',
      render: <Storage />,
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
        <Col xs={12} className='Center mb-2'>
          {serviceWorkerRegistration ? (
            <Button color='accent' onClick={UpdateAppVersion}>
              {appVerisionText}
            </Button>
          ) : (
            <h6>{appVerisionText}</h6>
          )}
        </Col>
      </Row>
      <Row>
        <Col xs={12} className='p-0'>
          <BasicTabs activeTab={activeTab} tabs={tabs} onClick={handleTabChange} />
        </Col>
      </Row>
    </Container>
  )
}

Settings.propTypes = {
  serviceWorkerRegistration: PropTypes.object,
  appVersion: PropTypes.string,
  UpdateAppVersion: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
