import React, { useEffect, useState, useMemo } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "store/provider"
import { BasicProgress, Header } from "../"
import { Container, Row, Col } from "reactstrap"
import { ButtonClearCache } from "../"
import { formatBytes, getStringBytes } from "../../utils"
import { EntriesPropTypes } from "../../redux/Entries/propTypes"
import { CloudDownload } from "../../images/SVG"
import {
  PersistedStorageReduxKey,
  isQuotaExceeded,
} from "../../redux/localState"

const LOCAL_STORAGE_LIMIT = 10 * 1024 * 1024
const SERVER_STORAGE_LIMIT = 500 * 1024 * 1024
const LOCAL_STORAGE_QOUTA_LIMIT_TEST = "qoutaLimitTest"
const LOCAL_STORAGE_QOUTA_LIMIT_TEST_ITERATIONS = ~~(LOCAL_STORAGE_LIMIT / 100)

const mapStateToProps = (state) => {
  const {
    App: {
      version,
      localStorageUsage,
      localStorageQuota,
      localStorageUsageDetails,
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
}) => {
  const [localStorageLimitBytes, setLocalStorageLimitBytes] = useState(
    reduxStoreUsage
  )

  useEffect(() => {
    var i = 0
    var previousLocalStorage = ""
    try {
      for (
        i = LOCAL_STORAGE_QOUTA_LIMIT_TEST_ITERATIONS;
        i <= LOCAL_STORAGE_LIMIT;
        i += LOCAL_STORAGE_QOUTA_LIMIT_TEST_ITERATIONS
      ) {
        const currentLocalStorageTest =
          localStorage.getItem(LOCAL_STORAGE_QOUTA_LIMIT_TEST) || ""
        const currentReduxLocalStorage =
          localStorage.getItem(PersistedStorageReduxKey) || ""
        previousLocalStorage = currentLocalStorageTest.concat(
          currentReduxLocalStorage
        )
        localStorage.setItem(
          LOCAL_STORAGE_QOUTA_LIMIT_TEST,
          new Array(i).join("a")
        )
      }
    } catch (e) {
      if (isQuotaExceeded(e)) {
        const previousLocalStorageBytes = getStringBytes(previousLocalStorage)
        if (previousLocalStorageBytes !== localStorageLimitBytes) {
          setLocalStorageLimitBytes(previousLocalStorageBytes)
          localStorage.removeItem(LOCAL_STORAGE_QOUTA_LIMIT_TEST)
        }
      }
    }
  }, [localStorageLimitBytes])

  const reduxStorageLabel = `${formatBytes(reduxStoreUsage)} / ${formatBytes(
    localStorageLimitBytes
  )}`

  const serverUsage = useMemo(
    () =>
      items
        .concat(filteredItems)
        .reduce((usage, entry) => (usage += entry.size || 0), 0),
    [items, filteredItems]
  )

  const serverStorageLabel = `${formatBytes(serverUsage)} / ${formatBytes(
    SERVER_STORAGE_LIMIT
  )}`

  // const bars = [
  //   { value: entriesStorageUsage, showPercentage: true, label: "Entries" },
  //   { value: 25678, showPercentage: true, label: "Test" },
  // ]

  return (
    <Container fluid>
      <Row>
        <Header>
          <i className="fas fa-hdd mr-1" />
          Local Storage Usage
        </Header>
      </Row>
      <Row>
        <Col xs={12} className="p-0">
          <BasicProgress
            label={reduxStorageLabel}
            showPercentage
            value={reduxStoreUsage}
            max={localStorageLimitBytes}
          />
        </Col>
      </Row>
      <Row className="text-center my-3">
        <Col xs={12}>
          <ButtonClearCache />
        </Col>
      </Row>
      <Row>
        <Header height={50}>
          <CloudDownload className="mr-1" height={37} />
          Server Usage
        </Header>
      </Row>
      <Row>
        <Col xs={12} className="p-0">
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
