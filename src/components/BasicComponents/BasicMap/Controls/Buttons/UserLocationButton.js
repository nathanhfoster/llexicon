import React, { useEffect, memo, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'reactstrap'
import defaultStyles from './defaultStyles'
import { CENTER_OF_US, DEFAULT_ZOOM } from '../../constants'
import { useGeolocation } from 'hooks'

const UserLocationButton = ({ mapApi, panTo, SetUserLocation }) => {
  const [geoState, { onChange }] = useGeolocation({
    enableHighAccuracy: true,
    timeout: 0xffffffff,
    maximumAge: 0,
  })

  onChange(() => {
    const { isSupported, isRetrieving, position } = geoState
    SetUserLocation(position)
  })

  useEffect(() => {
    return () => {
      SetUserLocation(null)
    }
  }, [])

  const handleOnClick = () => {
    const {
      position: {
        coords: { accuracy, altitude, altitudeAccuracy, heading, latitude, longitude, speed },
        timestamp,
      },
    } = geoState

    panTo({
      center: { lat: latitude, lng: longitude },
      zoom: 16,
    })
  }

  return (
    <Button
      color='white'
      style={{ ...defaultStyles, padding: 0 }}
      disabled={!geoState.position}
      // onClick={handleOnClick}
    >
      <i className='fas fa-user-circle fa-2x' aria-label='myLocation' />
    </Button>
  )
}

UserLocationButton.propTypes = {}

export default memo(UserLocationButton)
