import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import PolygonSystem from '../PolygonSystem'
import GooglePolygon from '../NativePolygonSystem/GooglePolygon'
import cloneDeep from 'lodash/cloneDeep'
import { formatBoundaries } from '../../../services/map'
import { fetchDrawnSite } from '../../../../actions/MetaActions'
import deepEquals from '../../../helpers/deepEquals'
import {
  DEFAULT_STROKE,
  SELECTED_COLOR,
  NOT_ATTACHED_OR_SELECTED_COLOR
} from '../PolygonSystem/getOptions'
import { Geometry } from '../classes'

const mapDispatchToProps = { fetchDrawnSite }

class DrawingManager extends Component {
  constructor(props) {
    super(props)

    const { mousePos, options, shouldRenderPolygons } = props
    const polygon = this.getInitialPolygon(mousePos)

    this.state = {
      mousePos,
      options,
      drawingPolyline: false,
      shouldCompletePolygon: false,
      drawnPolylineIsIntersecting: false,
      shouldRenderPolygons,
      polygon
    }
  }

  static propTypes = {
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
    fetchDrawnSite: PropTypes.func.isRequired,
    mapApi: PropTypes.object.isRequired
  }

  static defaultProps = {
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

  static getDerivedStateFromProps(nextProps, prevState) {
    let { height, width, zoom } = nextProps
    const { $dimensionKey, $geoService, mousePos, bounds } = nextProps

    const {
      polygon,
      options,
      shouldCompletePolygon,
      shouldRenderPolygons,
      drawingPolyline
    } = prevState

    if ($geoService) {
      height = $geoService.getHeight()
      width = $geoService.getWidth()
      zoom = $geoService.getZoom()
    }

    return {
      mousePos,
      bounds,
      height,
      width,
      zoom,
      shouldRenderPolygons,
      polygon,
      options,
      shouldCompletePolygon,
      drawingPolyline
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const propsChanged = !deepEquals(this.props, nextProps)
    const stateChanged = !deepEquals(this.state, nextState)

    return propsChanged || stateChanged
  }

  getInitialPolygon = ({ lat, lng }) => {
    const polygon = {
      lat,
      lng,
      boundary: [{ lat, lng }]
    }

    return polygon
  }

  getInitialStartingPolygon = () => {
    const {
      mousePos: { lat, lng }
    } = this.state

    const polyline = { lat, lng }

    const mousePosPolyline = polyline

    const polygon = {
      lat,
      lng,
      boundary: [polyline, mousePosPolyline]
    }

    return polygon
  }

  handlePolygonStart = () => {
    const polygon = this.getInitialStartingPolygon()

    this.setState({
      drawingPolyline: true,
      polygon
    })
  }

  handlePolygonComplete = () => {
    const { toggleDrawingMode, fetchDrawnSite, mapApi } = this.props
    const { polygon } = this.state

    let newPolygon = cloneDeep(polygon)

    const firstPolyline = newPolygon.boundary[0]
    const lastPolylineIndex = newPolygon.boundary.length - 1
    newPolygon.boundary[lastPolylineIndex] = firstPolyline

    const googlePolygon = GooglePolygon({ paths: newPolygon.boundary })
    const paths = googlePolygon.getPath()
    const boundaries = formatBoundaries(paths.getArray())
    const acres = mapApi.geometry.spherical.computeArea(paths) * 0.000247105

    const newSite = {
      siteType: 'USER_DEFINED',
      acreage: acres,
      boundary: boundaries
    }

    fetchDrawnSite(newSite)

    const initialPolygon = this.getInitialStartingPolygon()

    this.setState({
      polygon: initialPolygon,
      shouldCompletePolygon: false,
      drawnPolylineIsIntersecting: false,
      drawingPolyline: false
    })

    return toggleDrawingMode()
  }

  handleAddingNewPolyline = () => {
    const {
      polygon,
      mousePos: { lat, lng },
      drawnPolylineIsIntersecting
    } = this.state

    if (drawnPolylineIsIntersecting) return

    let newPolygon = cloneDeep(polygon)

    const newPolyline = {
      lat,
      lng
    }

    newPolygon.boundary.push(newPolyline)

    this.setState({ polygon: newPolygon })
  }

  handleShouldCompletePolygon = (point, centerOfCircle) => {
    const radius = Math.pow(0.00005, 2)
    const distance =
      Math.pow(point.lat - centerOfCircle.lat, 2) + Math.pow(point.lng - centerOfCircle.lng, 2)

    if (distance < radius) {
      return true
    }
    return false
  }

  handleClick = () => {
    const { drawingPolyline, shouldCompletePolygon } = this.state

    if (!drawingPolyline) {
      this.handlePolygonStart()
    } else if (shouldCompletePolygon) {
      this.handlePolygonComplete()
    } else {
      this.handleAddingNewPolyline()
    }
  }

  handleMouseMove = () => {
    const { polygon, drawingPolyline, mousePos, options } = this.state
    const intersectingOpacity = 0.9
    const completedOpacity = 0.9
    const regularOpacity = 0.4

    if (!drawingPolyline) return

    let newPolygon = cloneDeep(polygon)
    const lastPolylineIndex = newPolygon.boundary.length - 1

    newPolygon.boundary[lastPolylineIndex] = { lat: mousePos.lat, lng: mousePos.lng }

    const geometry = new Geometry({ points: newPolygon.boundary })

    const drawnPolylineIsIntersecting = geometry.intersects()

    const fill = drawnPolylineIsIntersecting ? NOT_ATTACHED_OR_SELECTED_COLOR : SELECTED_COLOR

    const shouldCompletePolygon =
      this.handleShouldCompletePolygon(mousePos, newPolygon) && !drawnPolylineIsIntersecting

    const fillOpacity = drawnPolylineIsIntersecting
      ? intersectingOpacity
      : shouldCompletePolygon
        ? completedOpacity
        : regularOpacity

    const newOptions = { ...options, fillOpacity, fill }

    this.setState({
      polygon: newPolygon,
      options: newOptions,
      shouldCompletePolygon,
      drawnPolylineIsIntersecting
    })
  }

  renderPolygon = () => {
    const { polygon, bounds, options, shouldRenderPolygons, height, width, zoom } = this.state

    if (!shouldRenderPolygons) return null
    else {
      const { lat, lng, boundary } = polygon

      return (
        <PolygonSystem
          key="userDefinedPolygon"
          id="userDefinedPolygon"
          lat={bounds.ne.lat}
          lng={bounds.nw.lng}
          center={[lat, lng]}
          bounds={bounds}
          coords={boundary}
          options={options}
          height={height}
          width={width}
          zoom={zoom}
        />
      )
    }
  }

  render() {
    return (
      <div onClick={this.handleClick} onMouseMove={this.handleMouseMove}>
        {this.renderPolygon()}
      </div>
    )
  }
}
export default reduxConnect(null, mapDispatchToProps)(DrawingManager)
