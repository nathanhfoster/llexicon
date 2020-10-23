import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import { BasicProgress, Header, ButtonClearCache, ButtonClearEntries } from 'components'
import { Container, Row, Col, ButtonGroup } from 'reactstrap'
import { formatBytes, getStringBytes } from 'utils'
import { EntriesPropTypes } from 'redux/Entries/propTypes'
import { CloudDownload } from '../../images/SVG'
import { DATEBASE_SIZE, LOCAL_STORAGE_REDUCERS, INDEX_DB_REDUCERS } from 'components/Persistor'

const SERVER_STORAGE_LIMIT = 500 * 1024 * 1024

const mapStateToProps = state => {
  const {
    App: {
      version,
      localStorageCapacity,
      localStorageUsage,
      localStorageQuota,
      localStorageUsageDetails,
    },
    Entries: { items, filteredItems },
    // Entries,
  } = state
  const localStorageReduxUsage = getStringBytes(
    LOCAL_STORAGE_REDUCERS.reduce((acc, reducer) => {
      acc[reducer] = state[reducer]
      return acc
    }, {}),
  )
  const indexDBStorageReduxUsage = getStringBytes(
    INDEX_DB_REDUCERS.reduce((acc, reducer) => {
      acc[reducer] = state[reducer]
      return acc
    }, {}),
  )
  // const entriesStorageUsage = getStringBytes(Entries)

  return {
    localStorageReduxUsage,
    indexDBStorageReduxUsage,
    items,
    filteredItems,
    // entriesStorageUsage,
    version,
    localStorageCapacity,
    localStorageUsage,
    localStorageQuota,
    localStorageUsageDetails,
  }
}

const LocalStorage = ({
  localStorageReduxUsage,
  indexDBStorageReduxUsage,
  items,
  filteredItems,
  entriesStorageUsage,
  version,
  localStorageCapacity,
  localStorageUsage,
  localStorageQuota,
  localStorageUsageDetails,
}) => {
  const localStroageReduxLabel = useMemo(
    () => `${formatBytes(localStorageReduxUsage)} / ${formatBytes(localStorageCapacity)}`,
    [localStorageReduxUsage, localStorageCapacity],
  )

  const indexDbStorageLabel = useMemo(
    () => `${formatBytes(indexDBStorageReduxUsage)} / ${formatBytes(DATEBASE_SIZE)}`,
    [indexDBStorageReduxUsage],
  )

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
            label={localStroageReduxLabel}
            showPercentage
            value={localStorageReduxUsage}
            max={DATEBASE_SIZE}
          />
        </Col>
      </Row>
      <Row className='my-2'>
        <Header height={50}>
          <i className='fas fa-database mr-1' />
          IndexDB Usage
        </Header>
      </Row>
      <Row>
        <Col xs={12} className='p-0'>
          <BasicProgress
            label={indexDbStorageLabel}
            showPercentage
            value={serverUsage}
            max={SERVER_STORAGE_LIMIT}
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
  localStorageReduxUsage: PropTypes.number,
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

export default reduxConnect(mapStateToProps)(LocalStorage)
