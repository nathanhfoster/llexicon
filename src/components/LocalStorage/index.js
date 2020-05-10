import React, { useMemo } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { BasicProgress, Header } from "../"
import { Container, Row, Col } from "reactstrap"
import { ButtonClearCache } from "../"
import { formatBytes, getStringBytes } from "../../helpers"
import { EntriesPropTypes } from "../../redux/Entries/propTypes"

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
  const localStorageLimit = 5 * 1024 * 1024
  const reduxStorageLabel = `${formatBytes(reduxStoreUsage)} / ${formatBytes(
    localStorageLimit
  )}`

  const serverUsage = useMemo(
    () =>
      items
        .concat(filteredItems)
        .reduce((usage, entry) => (usage += entry.size || 0), 0),
    [items, filteredItems]
  )

  const serverStorageLimit = 5 * 1024 * 1024 * 100
  const serverStorageLabel = `${formatBytes(serverUsage)} / ${formatBytes(
    serverStorageLimit
  )}`

  // const bars = [
  //   { value: entriesStorageUsage, showPercentage: true, label: "Entries" },
  //   { value: 25678, showPercentage: true, label: "Test" },
  // ]

  return (
    <Container fluid>
      <Row>
        <Header>Local Storage Usage</Header>
      </Row>
      <Row>
        <Col xs={12} className="p-0">
          <BasicProgress
            label={reduxStorageLabel}
            showPercentage
            value={reduxStoreUsage}
            max={localStorageLimit}
          />
        </Col>
      </Row>
      <Row className="text-center my-3">
        <Col xs={12}>
          <ButtonClearCache />
        </Col>
      </Row>
      <Row>
        <Header>Server Usage</Header>
      </Row>
      <Row>
        <Col xs={12} className="p-0">
          <BasicProgress
            label={serverStorageLabel}
            showPercentage
            value={serverUsage}
            max={serverStorageLimit}
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
