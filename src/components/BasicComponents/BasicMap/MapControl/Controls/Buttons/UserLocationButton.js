import React, { useRef, useEffect, memo } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'reactstrap'
import defaultStyles from './defaultStyles'
import { CENTER_OF_US, DEFAULT_ZOOM } from '../../../constants'
import { usePrevious } from 'hooks'

const UserLocationButton = ({ panTo, UserLocation, WatchUserLocation }) => {
  console.log(UserLocation)
  const watchId = useRef(false)
  const prevUserLocation = usePrevious(UserLocation)

  useEffect(() => {
    if (
      !prevUserLocation?.latitude &&
      UserLocation?.latitude &&
      !prevUserLocation?.longitude &&
      UserLocation?.longitude
    ) {
      panTo({
        center: { lat: UserLocation.latitude, lng: UserLocation.longitude },
        zoom: 16,
      })
    }
  }, [UserLocation, prevUserLocation])

  useEffect(() => {
    watchId.current = WatchUserLocation()
    return () => {
      if (watchId.current) {
        watchId.current = WatchUserLocation(watchId.current)
      }
    }
  }, [WatchUserLocation])

  const handleOnClick = () => {
    console.log('handleOnClick')
    if (!watchId.current) {
      watchId.current = WatchUserLocation()
    }
  }

  return (
    <Button color='white' style={{ ...defaultStyles, padding: 0 }} onClick={handleOnClick}>
      <i
        className='fas fa-user-circle fa-2x'
        aria-label='myLocation'
        onClick={e => console.log(e)}
      />
    </Button>
  )
}

UserLocationButton.propTypes = {
  UserLocation: PropTypes.shape({
    latitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    longitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
}

export default memo(UserLocationButton)
