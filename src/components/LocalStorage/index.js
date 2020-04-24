import React from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { BasicProgress } from "../"
import { formatBytes } from "../../helpers"

const getStringBytes = (object) =>
  JSON.stringify(object).split(/%..|./).length - 1

const mapStateToProps = (state) => {
  const {
    App: {
      version,
      localStorageUsage,
      localStorageQuota,
      localStorageUsageDetails,
    },
    // Entries,
  } = state
  const reduxStoreUsage = getStringBytes(state)
  // const entriesStorageUsage = getStringBytes(Entries)

  return {
    reduxStoreUsage,
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
  entriesStorageUsage,
  version,
  localStorageUsage,
  localStorageQuota,
  localStorageUsageDetails,
}) => {
  const localStorageLimit = 5 * 1024 * 1024
  const label = `${formatBytes(reduxStoreUsage)} / ${formatBytes(
    localStorageLimit
  )}`

  // const bars = [
  //   { value: entriesStorageUsage, showPercentage: true, label: "Entries" },
  //   { value: 25678, showPercentage: true, label: "Test" },
  // ]

  return (
    <BasicProgress
      label={label}
      showPercentage
      value={reduxStoreUsage}
      max={localStorageLimit}
    />
  )
}

LocalStorage.propTypes = {
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
