import React, { memo } from "react"
import { Button } from "reactstrap"
import defaultStyles from "./defaultStyles"
import { CENTER_OF_US, DEFAULT_ZOOM } from "../../../constants"

const onClick = ({ panTo, UserLocation: { latitude, longitude } }) => {
  panTo({
    center: { lat: latitude, lng: longitude },
    zoom: 16
  })
}

const RecenterZoomButton = props => {
  return (
    <Button color="white" style={{ ...defaultStyles, padding: 0 }}>
      <i
        className="fas fa-user-circle fa-2x"
        aria-label="myLocation"
        onClick={() => onClick(props)}
      />
    </Button>
  )
}

export default memo(RecenterZoomButton)
