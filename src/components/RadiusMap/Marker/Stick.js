import React, { Fragment, memo } from "react"
import PropTypes from "prop-types"
import { useHistory } from "react-router-dom"
import { RouterPush, RouteMap } from "../../ReactRouter/Routes"
import { GetAddress } from "../../../redux/Actions/Google"
import {
  K_CIRCLE_SIZE,
  K_BORDER_WIDTH,
  locationCircleStyle,
  locationCircleStyleHover,
  locationStickStyle,
  locationStickStyleHover,
  locationStickStyleShadow
} from "./styles"

import { DEFAULT_POLYGON_MIN_ZOOM } from "../constants"

const infoClick = ({
  $dimensionKey,
  onChangeCallback,
  lat,
  lng,
  getAddressOnMarkerClick,
  history
}) => {
  if ($dimensionKey === "NewEntry") {
    RouterPush(history, RouteMap.NEW_ENTRY)
  } else if (!getAddressOnMarkerClick) {
    return onChangeCallback({
      entryId: $dimensionKey,
      latitude: lat,
      longitude: lng
    })
  } else {
    GetAddress(lat, lng)
      .then(address =>
        onChangeCallback({
          entryId: $dimensionKey,
          latitude: lat,
          longitude: lng,
          address
        })
      )
      .catch(e => onChangeCallback({ latitude: lat, longitude: lng }))
  }
}

const zoomStyle = {
  fontSize: 14
}

const ClientNameCharacter = props => {
  const { $dimensionKey, renderUserLocation } = props
  const className =
    $dimensionKey === "NewEntry"
      ? "fas fa-search-location"
      : renderUserLocation
      ? "fas fa-user-circle"
      : "fas fa-circle"
  const style = {
    fontSize: renderUserLocation ? "inherit" : K_CIRCLE_SIZE / 2
  }
  return (
    <i className={className} style={style} onClick={() => infoClick(props)} />
  )
  // if (!clientName) clientName = 'P'
  // return <span style={clientNameCharacterStyle}>{clientName.charAt(0).toUpperCase()}</span>
}

const Zoom = props => {
  const { $dimensionKey, renderUserLocation } = props
  const className =
    $dimensionKey === "NewEntry"
      ? "fas fa-feather-alt"
      : renderUserLocation
      ? "fas fa-user-circle fa-2x"
      : "fas fa-circle"
  return (
    <span style={zoomStyle} onClick={() => infoClick(props)}>
      <i className={className} />
    </span>
  )
}

const Stick = props => {
  const history = useHistory()
  const { shouldShowPreview, inGroup, zoom } = props
  let text = ClientNameCharacter({ ...props, history })
  let circleStyle = locationCircleStyle
  let stickStyle = locationStickStyle

  if (shouldShowPreview) {
    text = Zoom({ ...props, history })
    circleStyle = locationCircleStyleHover
    stickStyle = locationStickStyleHover
  }

  return (
    <Fragment>
      <div style={circleStyle}>{text}</div>
      <div style={stickStyle} />
    </Fragment>
  )
}

Stick.propTypes = {
  $dimensionKey: PropTypes.string,
  clientName: PropTypes.string,
  shouldShowPreview: PropTypes.bool,
  inGroup: PropTypes.bool,
  center: PropTypes.arrayOf(PropTypes.number.isRequired),
  renderUserLocation: PropTypes.bool,
  getAddressOnMarkerClick: PropTypes.bool.isRequired
}

export default memo(Stick)
