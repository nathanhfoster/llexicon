import React from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { BasicProgress } from "../"
import { formatBytes } from "../../helpers"

const mapStateToProps = (state) => {
  const reduxStoreUsage = JSON.stringify(state).split(/%..|./).length - 1
  const {
    App: {
      version,
      localStorageUsage,
      localStorageQuota,
      localStorageUsageDetails,
    },
  } = state
  return {
    reduxStoreUsage,
    version,
    localStorageUsage,
    localStorageQuota,
    localStorageUsageDetails,
  }
}

const mapDispatchToProps = {}

const LocalStorage = ({
  reduxStoreUsage,
  version,
  localStorageUsage,
  localStorageQuota,
  localStorageUsageDetails,
}) => {
  const localStorageLimit = 5 * 1024 * 1024
  const title = `${formatBytes(reduxStoreUsage)} / ${formatBytes(
    localStorageLimit
  )}`

  return (
    <BasicProgress
      //   title={title}
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
