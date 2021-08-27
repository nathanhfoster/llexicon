import React, { memo, useCallback, useEffect } from "react"
import PropTypes from "prop-types"
import { Button } from "reactstrap"
import defaultStyles from "./defaultStyles"
import { CENTER_OF_US, DEFAULT_ZOOM } from "../../constants"
import { useGeolocation } from "hooks"

const UserLocationButton = ({
  map,
  controlPosition,
  panTo,
  SetUserLocation,
}) => {
  const [geoState, { onChange }] = useGeolocation({
    enableHighAccuracy: true,
    timeout: 0xffffffff,
    maximumAge: 0,
  })
  const { isSupported, isRetrieving, position } = geoState

  onChange(() => {
    SetUserLocation(position)
  })

  const handleOnClick = useCallback(() => {
    const { latitude, longitude } = geoState.position.coords

    panTo({
      center: { lat: latitude, lng: longitude },
      zoom: 16,
    })
  }, [panTo, geoState?.position?.coords])

  useEffect(() => {
    if (map?.controls[controlPosition]) {
      const firstKey = Object.keys(map?.controls[controlPosition])[0]
      if (map?.controls[controlPosition][firstKey]?.length > 0) {
        map.controls[controlPosition][firstKey][0].children[0].addEventListener(
          "click",
          handleOnClick
        )

        return () => {
          map.controls[controlPosition][
            firstKey
          ][0].children[0].removeEventListener("click", handleOnClick)
          SetUserLocation(null)
        }
      }
    }
  }, [controlPosition, handleOnClick, SetUserLocation, map.controls])

  return isSupported ? (
    <Button
      color="white"
      disabled={isRetrieving || !geoState.position}
      style={{ ...defaultStyles, padding: 0 }}
    >
      <i className="fas fa-user-circle fa-2x" aria-label="myLocation" />
    </Button>
  ) : null
}

UserLocationButton.propTypes = {
  map: PropTypes.object,
  controlPosition: PropTypes.number,
  panTo: PropTypes.func.isRequired,
  SetUserLocation: PropTypes.func.isRequired,
}

export default memo(UserLocationButton)
