import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import PolygonSystem from '../PolygonSystem'
import GooglePolygon from '../NativePolygonSystem/GooglePolygon'
import cloneDeep from 'lodash/cloneDeep'
import { formatBoundaries } from '../../../services/map'
import { fetchDrawnSite } from '../../../../actions/MetaActions'
import deepEquals from '../../../helpers/deepEquals'
import { DEFAULT_STROKE, SELECTED_COLOR } from '../PolygonSystem/getOptions'

const mapDispatchToProps = { fetchDrawnSite }

class DrawingManager extends Component {
  constructor(props) {
    super(props)

    const { mousePos, options, shouldRenderPolygons } = props
    const { lat, lng } = mousePos

    this.state = {
      mousePos,
      options,
      drawingPolyline: false,
      drawingPolylineIndex: 0,
      shouldCompletePolygon: false,
      shouldRenderPolygons,
      polygon: {
        lat,
        lng,
        boundary: [{ lat, lng }]
      }
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
    mapApi: PropTypes.func.isRequired
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
      drawingPolyline,
      drawingPolylineIndex
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
      drawingPolyline,
      drawingPolylineIndex
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const propsChanged = !deepEquals(this.props, nextProps)
    const stateChanged = !deepEquals(this.state, nextState)

    return propsChanged || stateChanged
  }

  // getSnapshotBeforeUpdate(prevProps, prevState) {
  //   return null
  // }

  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   // const { mousePos } = prevState
  //   // this.setState({ mousePos })
  // }

  handlePolygonStart = (polygon, drawingPolylineIndex) => {
    this.setState({
      drawingPolyline: true,
      polygon,
      drawingPolylineIndex: drawingPolylineIndex + 1
    })
  }

  handlePolygonComplete = polygon => {
    const { toggleDrawingMode, fetchDrawnSite, mapApi } = this.props
    const {
      mousePos: { lat, lng }
    } = this.state
    const Polygon = GooglePolygon({ paths: polygon.boundary })
    const paths = Polygon.getPath()

    const acres = mapApi.geometry.spherical.computeArea(paths) * 0.000247105

    const boundaries = formatBoundaries(paths.getArray())
    const newSite = {
      siteType: 'USER_DEFINED',
      acreage: acres,
      boundary: boundaries
    }

    fetchDrawnSite(newSite)
    this.setState({
      polygon: {
        lat,
        lng,
        boundary: [{ lat, lng }]
      },
      shouldCompletePolygon: false,
      drawingPolyline: false,
      drawingPolylineIndex: 0
    })
    return toggleDrawingMode()
  }

  shouldCompletePolygon = (point, centerOfCircle) => {
    const radius = Math.pow(0.00005, 2)
    const distance =
      Math.pow(point.lat - centerOfCircle.lat, 2) + Math.pow(point.lng - centerOfCircle.lng, 2)

    if (distance < radius) {
      return true
    }
    return false
  }

  handleClick = (polygon, drawingPolyline, { lat, lng }) => {
    const { shouldCompletePolygon, drawingPolylineIndex } = this.state
    let newPolygon = cloneDeep(polygon)

    if (!drawingPolyline) {
      newPolygon = {
        lat,
        lng,
        boundary: [{ lat, lng }]
      }
      this.handlePolygonStart(newPolygon, drawingPolylineIndex)
    } else if (shouldCompletePolygon) {
      const firstPolyline = newPolygon.boundary[0]
      const lastPolylineIndex = newPolygon.boundary.length - 1
      newPolygon.boundary[lastPolylineIndex] = firstPolyline
      this.handlePolygonComplete(newPolygon)
    } else {
      this.setState({ drawingPolylineIndex: drawingPolylineIndex + 1 })
    }
  }

  handleMouseMove = (polygon, drawingPolyline, mousePos, options) => {
    const completedOpacity = 0.8
    const regularOpacity = 0.4

    if (!drawingPolyline) return

    const { drawingPolylineIndex } = this.state
    let newPolygon = cloneDeep(polygon)
    newPolygon.boundary[drawingPolylineIndex] = { lat: mousePos.lat, lng: mousePos.lng }

    const fillOpacity = this.shouldCompletePolygon(mousePos, newPolygon)
      ? completedOpacity
      : regularOpacity
    const newOptions = { ...options, fillOpacity }

    this.setState({
      polygon: newPolygon,
      options: newOptions,
      shouldCompletePolygon: fillOpacity === completedOpacity
    })
  }

  renderPolygon = polygon => {
    const { bounds, options, shouldRenderPolygons, height, width, zoom } = this.state

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
    const { polygon, drawingPolyline, mousePos, options } = this.state

    return (
      <div
        onClick={() => this.handleClick(polygon, drawingPolyline, mousePos)}
        onMouseMove={() => this.handleMouseMove(polygon, drawingPolyline, mousePos, options)}
      >
        {this.renderPolygon(polygon)}
      </div>
    )
  }
}
export default reduxConnect(null, mapDispatchToProps)(DrawingManager)
