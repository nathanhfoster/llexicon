import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Marker from '../Marker'
import { WatchUserLocation } from 'redux/User/actions'

const mapStateToProps = ({ User: { location } }) => ({ userLocation: location })

const mapDispatchToProps = { WatchUserLocation }

const UserLocationMarker = ({ userLocation, onChange, WatchUserLocation }) => {
  const watchId = useRef(null)

  useEffect(() => {
    watchId.current = WatchUserLocation()
    return () => WatchUserLocation(watchId.current)
  }, [])
  return (
    <Marker
      key='MyLocation'
      lat={userLocation.latitude}
      lng={userLocation.longitude}
      onChange={onChange}
    />
  )
}

UserLocationMarker.propTypes = {
  UserLocation: PropTypes.object,
  onChange: PropTypes.func,
  WatchUserLocation: PropTypes.func,
}

export default connect(mapStateToProps, mapDispatchToProps)(UserLocationMarker)
