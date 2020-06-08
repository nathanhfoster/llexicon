import React, { useRef, useEffect, memo } from "react"
import PropTypes from "prop-types"
import { Button } from "reactstrap"
import defaultStyles from "./defaultStyles"
import { CENTER_OF_US, DEFAULT_ZOOM } from "../../../constants"

const UserLocationButton = ({
  panTo,
  UserLocation: { latitude, longitude },
  WatchUserLocation,
  onChangeCallback,
}) => {
  const watchId = useRef()
  
  useEffect(() => {
    return () => {
      if (watchId.current) {
        watchId.current = WatchUserLocation(watchId.current)
      }
    }
  }, [])

  const handleOnClick = () => {
    if (!watchId.current) {
      watchId.current = WatchUserLocation()
    }

    if (latitude && longitude) {
      panTo({
        center: { lat: latitude, lng: longitude },
        zoom: 16,
      })
    }
  }

  return (
    <Button color="white" style={{ ...defaultStyles, padding: 0 }}>
      <i
        className="fas fa-user-circle fa-2x"
        aria-label="myLocation"
        onClick={handleOnClick}
      />
    </Button>
  )
}

export default memo(UserLocationButton)
