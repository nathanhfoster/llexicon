import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Marker from '../Marker'
import { useGeolocation } from 'hooks'

const UserLocationMarker = ({ onChange }) => {
  const [geoState] = useGeolocation({
    enableHighAccuracy: true,
    timeout: 0xffffffff,
    maximumAge: 0,
  })

  const {
    isSupported,
    isRetrieving,
    position: {
      coords: { accuracy, altitude, altitudeAccuracy, heading, latitude, longitude, speed },
      timestamp,
    },
  } = geoState

  return <Marker key='MyLocation' lat={latitude} lng={longitude} onChange={onChange} />
}

UserLocationMarker.propTypes = {
  onChange: PropTypes.func,
}

export default memo(UserLocationMarker)
