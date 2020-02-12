import React, { useState, memo } from "react"
import PropTypes from "prop-types"
import { useDispatch } from "react-redux"
import PolygonSystem from "../PolygonSystem"
import GooglePolygon from "../NativePolygonSystem/GooglePolygon"
import cloneDeep from "lodash/cloneDeep"
import { formatBoundaries } from "../../../services/map"
import { fetchDrawnSite } from "../../../../actions/MetaActions"
import {
  DEFAULT_STROKE,
  SELECTED_COLOR,
  NOT_ATTACHED_OR_SELECTED_COLOR
} from "../PolygonSystem/getOptions"
import { Geometry } from "../classes"

const getInitialPolygon = ({ lat, lng }) => {
  const polygon = {
    lat,
    lng,
    boundary: [{ lat, lng }]
  }

  return polygon
}

const getInitialState = ({ mousePos, options }) => {
  const polygon = getInitialPolygon(mousePos)

  return {
    options,
    drawingPolyline: false,
    shouldCompletePolygon: false,
    drawnPolylineIsIntersecting: false,
    polygon
  }
}

const DrawingManager = props => {
  const dispatch = useDispatch()
  let { height, width, zoom } = props

  const {
    $dimensionKey,
    $geoService,
    mousePos,
    bounds,
    setMapCenterBoundsZoom,
    toggleDrawingMode,
    mapApi,
    shouldRenderPolygons
  } = props

  const [state, setState] = useState(getInitialState(props))

  const {
    polygon,
    options,
    shouldCompletePolygon,
    drawingPolyline,
    drawnPolylineIsIntersecting
  } = state

  if ($geoService) {
    height = $geoService.getHeight()
    width = $geoService.getWidth()
    zoom = $geoService.getZoom()
  }

  const getInitialStartingPolygon = () => {
    const { lat, lng } = mousePos

    const polyline = { lat, lng }

    const mousePosPolyline = polyline

    const polygon = {
      lat,
      lng,
      boundary: [polyline, mousePosPolyline]
    }

    return polygon
  }

  const handlePolygonStart = () => {
    const polygon = getInitialStartingPolygon()

    setState({
      ...state,
      drawingPolyline: true,
      polygon
    })
  }

  const handlePolygonComplete = () => {
    let newPolygon = cloneDeep(polygon)

    const firstPolyline = newPolygon.boundary[0]
    const lastPolylineIndex = newPolygon.boundary.length - 1
    newPolygon.boundary[lastPolylineIndex] = firstPolyline

    const googlePolygon = GooglePolygon({ paths: newPolygon.boundary })
    const paths = googlePolygon.getPath()
    const boundaries = formatBoundaries(paths.getArray())
    const acres = mapApi.geometry.spherical.computeArea(paths) * 0.000247105

    const newSite = {
      siteType: "USER_DEFINED",
      acreage: acres,
      boundary: boundaries
    }

    dispatch(fetchDrawnSite(newSite))

    const initialPolygon = getInitialStartingPolygon()

    setState({
      ...state,
      polygon: initialPolygon,
      shouldCompletePolygon: false,
      drawnPolylineIsIntersecting: false,
      drawingPolyline: false
    })

    return toggleDrawingMode()
  }

  const handleAddingNewPolyline = () => {
    const { lat, lng } = mousePos

    if (drawnPolylineIsIntersecting) return

    let newPolygon = cloneDeep(polygon)

    const newPolyline = {
      lat,
      lng
    }

    newPolygon.boundary.push(newPolyline)

    setState({ ...state, polygon: newPolygon })
  }

  const handleShouldCompletePolygon = (point, centerOfCircle) => {
    const radius = Math.pow(0.00005, 2)
    const distance =
      Math.pow(point.lat - centerOfCircle.lat, 2) +
      Math.pow(point.lng - centerOfCircle.lng, 2)

    if (distance < radius) {
      return true
    }
    return false
  }

  const handleClick = () => {
    if (!drawingPolyline) {
      handlePolygonStart()
    } else if (shouldCompletePolygon) {
      handlePolygonComplete()
    } else {
      handleAddingNewPolyline()
    }
  }

  const handleMouseMove = () => {
    const intersectingOpacity = 0.9
    const completedOpacity = 0.9
    const regularOpacity = 0.4

    if (!drawingPolyline) return

    let newPolygon = cloneDeep(polygon)
    const lastPolylineIndex = newPolygon.boundary.length - 1

    newPolygon.boundary[lastPolylineIndex] = {
      lat: mousePos.lat,
      lng: mousePos.lng
    }

    const geometry = new Geometry({ points: newPolygon.boundary })

    const drawnPolylineIsIntersecting = geometry.intersects()

    const fill = drawnPolylineIsIntersecting
      ? NOT_ATTACHED_OR_SELECTED_COLOR
      : SELECTED_COLOR

    const shouldCompletePolygon =
      handleShouldCompletePolygon(mousePos, newPolygon) &&
      !drawnPolylineIsIntersecting

    const fillOpacity = drawnPolylineIsIntersecting
      ? intersectingOpacity
      : shouldCompletePolygon
      ? completedOpacity
      : regularOpacity

    const newOptions = { ...options, fillOpacity, fill }

    setState({
      ...state,
      polygon: newPolygon,
      options: newOptions,
      shouldCompletePolygon,
      drawnPolylineIsIntersecting
    })
  }

  const { lat, lng, boundary } = polygon

  if (!shouldRenderPolygons) return null
  else
    return (
      <div onClick={handleClick} onMouseMove={handleMouseMove}>
        <PolygonSystem
          key="userDefinedPolygon"
          id="userDefinedPolygon"
          pointerEvents="auto"
          lat={bounds.ne.lat}
          lng={bounds.nw.lng}
          center={[lat, lng]}
          bounds={bounds}
          coords={boundary}
          options={options}
          height={height}
          width={width}
          zoom={zoom}
          setMapCenterBoundsZoom={setMapCenterBoundsZoom}
        />
      </div>
    )
}

DrawingManager.propTypes = {
  $dimensionKey: PropTypes.string,
  $geoService: PropTypes.object,
  $getDimensions: PropTypes.func,
  $hover: PropTypes.bool,
  $onMouseAllow: PropTypes.func,
  $prerender: PropTypes.bool,
  bounds: PropTypes.objectOf(PropTypes.objectOf(PropTypes.number)),
  lat: PropTypes.any.isRequired,
  lng: PropTypes.any.isRequired,
  mousePos: PropTypes.any.isRequired,
  options: PropTypes.any,
  height: PropTypes.any.isRequired,
  width: PropTypes.any.isRequired,
  toggleDrawingMode: PropTypes.func.isRequired,
  shouldRenderPolygons: PropTypes.bool.isRequired,
  mapApi: PropTypes.object.isRequired
}

DrawingManager.defaultProps = {
  height: 0,
  width: 0,
  zoom: 0,
  mousePos: {},
  options: {
    strokeWidth: 2,
    stroke: DEFAULT_STROKE,
    strokeOpacity: 1,
    fill: SELECTED_COLOR,
    fillOpacity: 0.4
  }
}

export default memo(DrawingManager)
