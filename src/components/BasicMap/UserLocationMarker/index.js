import React, { useRef, useEffect } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import Marker from "../../RadiusMap/Marker"
import { WatchUserLocation } from "../../../redux/User/actions"

const mapStateToProps = ({ User: { location } }) => ({ userLocation: location })

const mapDispatchToProps = { WatchUserLocation }

const UserLocationMarker = ({
  userLocation,
  onChangeCallback,
  WatchUserLocation
}) => {
  const watchId = useRef(null)

  useEffect(() => {
    watchId.current = WatchUserLocation()
    return () => WatchUserLocation(watchId.current)
  }, [])
  return (
    <Marker
      key="MyLocation"
      lat={userLocation.latitude}
      lng={userLocation.longitude}
      onChangeCallback={onChangeCallback}
    />
  )
}

UserLocationMarker.propTypes = {
  UserLocation: PropTypes.object,
  onChangeCallback: PropTypes.func,
  WatchUserLocation: PropTypes.func
}

export default reduxConnect(
  mapStateToProps,
  mapDispatchToProps
)(UserLocationMarker)
