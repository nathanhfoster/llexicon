import React, { useEffect, useMemo } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { withRouter } from "react-router-dom"
import { RouteMap, RouterGoBack } from "../../../routes"
import { SetApiResponseStatus } from "../../../redux/Alerts/actions"
import { stringMatch } from "../../../helpers"
import "./styles.css"

const { ENTRY_DETAIL } = RouteMap

const getSubtitles = (apiResponseStatus) => {
  switch (apiResponseStatus) {
    case 401:
      return ["THIS ENTRY IS", "NO LONGER PUBLIC"]

    case 404:
      return ["LOOKS LIKE YOU ARE", "LOST IN SPACE"]

    default:
      return ["LOOKS LIKE YOU ARE", "LOST IN SPACE"]
  }
}

const mapStateToProps = ({ Alerts: { apiResponseStatus } }) => ({
  apiResponseStatus,
})

const mapDispatchToProps = { SetApiResponseStatus }

const ApiStatusResponse = ({
  apiResponseStatus,
  SetApiResponseStatus,
  history,
}) => {
  const { pathname } = history.location

  useEffect(() => {
    const isOnEntryDetailView = stringMatch(
      pathname,
      ENTRY_DETAIL.replace(":entryId", "")
    )
    // Fix apiResponseStatus
    if (apiResponseStatus === 401 && !isOnEntryDetailView) {
      SetApiResponseStatus(404)
    }
    return () => {
      SetApiResponseStatus(404)
    }
  }, [])
  const handleGoBack = () => RouterGoBack(history)
  const renderSubtitles = useMemo(() => {
    const [subtitle1, subtitle2] = getSubtitles(apiResponseStatus)
    return (
      <div className="api-reponse-subtitle-container">
        <div className="api-reponse-subtitle">{subtitle1}</div>
        <div className="api-reponse-subtitle">{subtitle2}</div>
      </div>
    )
  }, [apiResponseStatus])
  return (
    <div className="central-body Container">
      <div className="api-reponse-title">{apiResponseStatus}</div>
      {renderSubtitles}
      <div onClick={handleGoBack} className="btn-go-home">
        TAKE ME BACK
      </div>
    </div>
  )
}

ApiStatusResponse.propTypes = {
  apiResponseStatus: PropTypes.number,
  SetApiResponseStatus: PropTypes.func.isRequired,
}

ApiStatusResponse.defaultProps = { apiResponseStatus: 404 }

export default reduxConnect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ApiStatusResponse))
