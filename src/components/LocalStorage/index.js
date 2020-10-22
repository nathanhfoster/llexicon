import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import { BasicProgress, Header, ButtonClearCache, ButtonClearEntries } from 'components'
import { Container, Row, Col, ButtonGroup } from 'reactstrap'
import { formatBytes, getStringBytes } from 'utils'
import { EntriesPropTypes } from 'redux/Entries/propTypes'
import { CloudDownload } from '../../images/SVG'

const SERVER_STORAGE_LIMIT = 500 * 1024 * 1024

const mapStateToProps = state => {
  const {
    App: {
      version,
      localStorageUsage,
      localStorageQuota,
      localStorageUsageDetails,
      localStorageCapacity,
    },
    Entries: { items, filteredItems },
    // Entries,
  } = state
  const reduxStoreUsage = getStringBytes(state)
  // const entriesStorageUsage = getStringBytes(Entries)

  return {
    reduxStoreUsage,
    items,
    filteredItems,
    // entriesStorageUsage,
    version,
    localStorageUsage,
    localStorageQuota,
    localStorageUsageDetails,
    localStorageCapacity,
  }
}

const mapDispatchToProps = {}

const LocalStorage = ({
  reduxStoreUsage,
  items,
  filteredItems,
  entriesStorageUsage,
  version,
  localStorageUsage,
  localStorageQuota,
  localStorageUsageDetails,
  localStorageCapacity,
}) => {
  const reduxStorageLabel = `${formatBytes(reduxStoreUsage)} / ${formatBytes(localStorageCapacity)}`

  const serverUsage = useMemo(
    () => items.concat(filteredItems).reduce((usage, entry) => (usage += entry.size || 0), 0),
    [items, filteredItems],
  )

  const serverStorageLabel = `${formatBytes(serverUsage)} / ${formatBytes(SERVER_STORAGE_LIMIT)}`

  // const bars = [
  //   { value: entriesStorageUsage, showPercentage: true, label: "Entries" },
  //   { value: 25678, showPercentage: true, label: "Test" },
  // ]

  return (
    <Container fluid>
      <Row>
        <Header>
          <i className='fas fa-hdd mr-1' />
          Local Storage Usage
        </Header>
      </Row>
      <Row>
        <Col xs={12} className='p-0'>
          <BasicProgress
            label={reduxStorageLabel}
            showPercentage
            value={reduxStoreUsage}
            max={localStorageCapacity}
          />
        </Col>
      </Row>
      <Row className='text-center my-3'>
        <Col tag={ButtonGroup} xs={12}>
          <ButtonClearCache />
          <div className='mx-1' />
          <ButtonClearEntries />
        </Col>
      </Row>
      <Row>
        <Header height={50}>
          <CloudDownload className='mr-1' height={37} />
          Server Usage
        </Header>
      </Row>
      <Row>
        <Col xs={12} className='p-0'>
          <BasicProgress
            label={serverStorageLabel}
            showPercentage
            value={serverUsage}
            max={SERVER_STORAGE_LIMIT}
          />
        </Col>
      </Row>
    </Container>
  )
}

LocalStorage.propTypes = {
  reduxStoreUsage: PropTypes.number,
  items: EntriesPropTypes,
  filteredItems: EntriesPropTypes,
  version: PropTypes.string,
  localStorageUsage: PropTypes.number,
  localStorageQuota: PropTypes.number,
  localStorageUsageDetails: PropTypes.shape({
    caches: PropTypes.number,
    indexedDB: PropTypes.number,
    serviceWorkerRegistrations: PropTypes.number,
  }),
}

LocalStorage.defaultProps = {}

export default reduxConnect(mapStateToProps, mapDispatchToProps)(LocalStorage)
