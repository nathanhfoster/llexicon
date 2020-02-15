import React, { useEffect, memo } from "react"
import PropTypes from "prop-types"
import Group from "./Group"
import Polyline from "./Polyline"
import toPoints from "../functions/toPoints"
import getOptions from "./getOptions"
import { DEFAULT_STROKE, ATTACHED_COLOR } from "./getOptions"
import memoizeProps from "../../../helpers/memoizeProps"

const PolygonSystem = ({
  $dimensionKey,
  $hover,
  $onMouseAllow,
  $getDimensions,
  $prerender,
  $geoService,
  bounds,
  coords,
  options,
  zoom,
  heading,
  tilt,
  id,
  clientId,
  center,
  clientName,
  engagingContacts,
  lastActivity,
  lat,
  lng,
  name,
  siteDescription,
  state,
  zipcode,
  _score,
  _attached,
  _selected,
  hoveredChildKey,
  setHoveredChildKey,
  getProjectFromId,
  setMapCenterBoundsZoom,
  risk,
  height,
  width,
  pointerEvents,
  onChildMouseEnter,
  onChildMouseLeave
}) => {
  // if (coords.length === 0) return null

  // Disable hover events and only allow them on the polyline level
  useEffect(() => {
    if ($onMouseAllow) {
      $onMouseAllow(true)
      return $onMouseAllow(false)
    }
  }, [])

  bounds = Object.keys(bounds)
    .map(key => {
      const { lat, lng } = bounds[key]
      return [lat, lng]
    })
    .flat(1)

  if ($geoService) {
    // bounds = $geoService.getBounds()
    height = $geoService.getHeight()
    width = $geoService.getWidth()
    zoom = $geoService.getZoom()
  }

  const newOptions = getOptions({
    $dimensionKey,
    id,
    $hover,
    options,
    _attached,
    _selected,
    hoveredChildKey,
    $onMouseAllow,
    zoom
  })

  if ($onMouseAllow) $onMouseAllow(false)

  const drawChildenCoords = coords => {
    const ptCorner = toPoints(bounds[0], bounds[1], zoom, heading, tilt)

    if (coords[0].hasOwnProperty("lat") && coords[0].hasOwnProperty("lng")) {
      return (
        <Polyline
          key={coords[0].lat + coords[0].lng}
          coords={coords}
          ptCorner={ptCorner}
          zoom={zoom}
          heading={heading}
          tilt={tilt}
          options={newOptions}
        />
      )
    }

    let children = []
    for (let i = 0; i < coords.length; i++) {
      if (Array.isArray(coords[i])) {
        if (Array.isArray(coords[i][0])) {
          children.push(
            <Group
              key={i}
              coords={coords[i]}
              ptCorner={ptCorner}
              zoom={zoom}
              options={newOptions}
            />
          )
        } else {
          children.push(drawChildenCoords(coords[i]))
        }
      }
    }
    return children
  }

  return (
    <svg height={height} width={width}>
      {drawChildenCoords(coords)}
    </svg>
  )
}

PolygonSystem.propTypes = {
  $dimensionKey: PropTypes.string,
  $geoService: PropTypes.object,
  $getDimensions: PropTypes.func,
  $hover: PropTypes.bool,
  $onMouseAllow: PropTypes.func,
  $prerender: PropTypes.bool,
  bounds: PropTypes.objectOf(PropTypes.objectOf(PropTypes.number)),
  coords: PropTypes.array,
  options: PropTypes.objectOf(PropTypes.any),
  zoom: PropTypes.number,
  zIndex: PropTypes.number,

  clientId: PropTypes.string,
  clientName: PropTypes.string,
  engagingContacts: PropTypes.array,

  lastActivity: PropTypes.string,
  lat: PropTypes.number,
  lng: PropTypes.number,
  name: PropTypes.string,
  siteDescription: PropTypes.string,
  state: PropTypes.string,
  height: PropTypes.any,
  width: PropTypes.any,
  zipcode: PropTypes.string,
  _score: PropTypes.number,

  _attached: PropTypes.bool,
  _id: PropTypes.number,
  _selected: PropTypes.bool
}

PolygonSystem.defaultProps = {
  _attached: false,
  _id: null,
  _selected: false,
  height: 0,
  width: 0,
  zoom: 0,
  tilt: 0,
  zIndex: 1,
  options: {
    stroke: DEFAULT_STROKE,
    strokeWidth: 1,
    strokeOpacity: 0.8,
    fill: ATTACHED_COLOR,
    fillOpacity: 0.3
  }
}

const getHover = ({ $hover, hoveredChildKey, $dimensionKey }) =>
  $hover || hoveredChildKey === $dimensionKey

const isEqual = (prevProps, nextProps) => {
  const previoushover = getHover(prevProps)
  const nextHover = getHover(nextProps)

  if (previoushover !== nextHover) return false
  else
    return memoizeProps(prevProps, nextProps, [
      "bounds",
      "options",
      "zoom",
      "heading",
      "tilt"
    ])
}

export default memo(PolygonSystem, isEqual)
