import React, { Fragment, memo } from "react"
import PropTypes from "prop-types"
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
  center,
  selectSite,
  setMapCenterBoundsZoom,
  history
}) => {
  selectSite($dimensionKey)
  setMapCenterBoundsZoom({ center })
  history.push(`/v2/projects/${$dimensionKey}`)
}

const zoomClick = ({ center, setMapCenterBoundsZoom }) =>
  setMapCenterBoundsZoom({ center, zoom: DEFAULT_POLYGON_MIN_ZOOM })

const infoStyle = {
  fontFamily: "Comic Sans MS"
}

const zoomStyle = {
  fontSize: 14
}

const ClientNameCharacter = renderUserLocation => {
  const className = renderUserLocation ? "fas fa-user-circle" : "fas fa-circle"
  return (
    <i
      className={className}
      style={{
        fontSize: renderUserLocation ? "inherit" : K_CIRCLE_SIZE / 2
      }}
    />
  )
  // if (!clientName) clientName = 'P'
  // return <span style={clientNameCharacterStyle}>{clientName.charAt(0).toUpperCase()}</span>
}

const Info = props => (
  <span style={infoStyle} onClick={() => infoClick(props)}>
    i
  </span>
)

const Zoom = props => (
  <span style={zoomStyle} onClick={() => zoomClick(props)}>
    <i className="fas fa-search-location" />
  </span>
)

const Stick = props => {
  const {
    clientName,
    shouldShowPreview,
    inGroup,
    zoom,
    renderUserLocation
  } = props
  let text = ClientNameCharacter(renderUserLocation)
  let circleStyle = locationCircleStyle
  let stickStyle = locationStickStyle

  const zoomOffset = DEFAULT_POLYGON_MIN_ZOOM - 3

  if (shouldShowPreview) {
    if (zoom <= zoomOffset) text = Zoom(props)
    else text = Info(props)
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
  selectSite: PropTypes.func.isRequired,
  setMapCenterBoundsZoom: PropTypes.func.isRequired,
  renderUserLocation: PropTypes.bool
}

export default memo(Stick)
