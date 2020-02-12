import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import GoogleMap from "google-map-react"

import Marker from "./Marker"
import MarkerCluster from "./MarkerCluster"

import PolygonSystem from "./PolygonSystem"
import DrawingManager from "./DrawingManager"
import MapControl from "./MapControl"
import { LocationList } from "../../components"
import fitCoordsToBounds from "./functions/fitCoordsToBounds"
import {
  resetProject,
  resetProjects,
  setProjectsSearchProps,
  fetchProjectIfNeeded
} from "../../../actions/ProjectActions"
import {
  setMapCenterBoundsZoom,
  fetchParlaySite,
  setMapSites,
  resetMap
} from "../../../actions/MetaActions"
import {
  GOOGLE_MAP_CONTROL_POSITIONS,
  GOOGLE_MAP_TYPE_CONTROL_STYLE,
  GOOGLE_MAP_TYPE_ID,
  CENTER_OF_US,
  DEFAULT_ZOOM,
  DEFAULT_MARKER_MIN_ZOOM,
  DEFAULT_MARKER_MAX_ZOOM,
  DEFAULT_POLYGON_MIN_ZOOM,
  DEFAULT_POLYGON_MAX_ZOOM,
  DEFAULT_PARLAY_MIN_ZOOM,
  DEFAULT_PARLAY_MAX_ZOOM,
  DEFAULT_MAP_OPTIONS
} from "./constants"
import { K_CIRCLE_SIZE, K_STICK_SIZE } from "./Marker/styles"
import styles from "./styles"
import deepEquals from "../../helpers/deepEquals"
import createClusters from "./functions/createClusters"
import formatLocations from "./functions/formatLocations"
import zoomWithinRange from "./functions/zoomWithinRange"
import "./styles.css"

const mapStateToProps = ({
  projects: {
    activeProject: { item },
    search
  },
  clients: { activeClient },
  meta: {
    map: { zoom, center, bounds, sites, siteDescription }
  }
}) => ({
  item,
  search,
  activeClient,
  zoom,
  center,
  bounds,
  sites: sites.filter(
    site => !(site._attached === false && site._selected === false)
  ),
  siteDescription
})

const mapDispatchToProps = {
  resetProject,
  resetProjects,
  setProjectsSearchProps,
  fetchProjectIfNeeded,

  setMapCenterBoundsZoom,
  fetchParlaySite,
  setMapSites,
  resetMap
}

class RadiusMap extends Component {
  mapRef = null
  mousePosRef = { x: null, y: null, lat: null, lng: null } // Used so we don't have to update state and rerender
  constructor(props) {
    super(props)
    let {
      shouldShowParlay,
      showParlayMinZoom,
      showParlayMaxZoom,
      options,
      shouldFitCoordsToBounds
    } = props

    options = { ...DEFAULT_MAP_OPTIONS, ...options }

    if (shouldShowParlay) {
      options = {
        ...options,
        zoom: showParlayMinZoom,
        minZoom: showParlayMinZoom,
        maxZoom: showParlayMaxZoom
      }
    }

    this.state = {
      hoveredChildKey: "",
      showingInfoWindow: false,
      zooming: false,
      shouldRenderPolygons: true,
      activeMarker: {},
      selectedPlace: {},
      mapInstance: null,
      mapApi: null,
      markerClusters: [],
      options,
      mousePos: {},
      shouldFitCoordsToBounds
    }
  }

  static propTypes = {
    // RadiusMap
    toggleKey: PropTypes.string,
    initialCenter: PropTypes.object,
    locations: PropTypes.arrayOf(PropTypes.any),
    sites: PropTypes.arrayOf(PropTypes.any).isRequired,
    locationsList: PropTypes.arrayOf(PropTypes.any),
    showMarkersMinZoom: PropTypes.number,
    showMarkersMaxZoom: PropTypes.number,
    showPolygonsMinZoom: PropTypes.number,
    showPolygonsMaxZoom: PropTypes.number,
    controls: PropTypes.arrayOf(PropTypes.object.isRequired),
    onCenterChange: PropTypes.func,
    onZoomChange: PropTypes.func,
    onHoverKeyChange: PropTypes.func,
    toggleDrawingMode: PropTypes.func,
    drawingMode: PropTypes.bool,
    shouldShowParlay: PropTypes.bool,
    shouldFitCoordsToBounds: PropTypes.bool,
    bounds: PropTypes.objectOf(PropTypes.objectOf(PropTypes.number)),
    setHoveredChildKey: PropTypes.func,
    hoveredChildKey: PropTypes.string,
    item: PropTypes.object.isRequired,
    search: PropTypes.object.isRequired,

    // Redux actions
    resetProject: PropTypes.func.isRequired,
    resetProjects: PropTypes.func.isRequired,
    setProjectsSearchProps: PropTypes.func.isRequired,
    fetchProjectIfNeeded: PropTypes.func.isRequired,
    fetchParlaySite: PropTypes.func.isRequired,
    setMapSites: PropTypes.func.isRequired,
    resetMap: PropTypes.func.isRequired,

    // GoogleMap from google-map-react
    apiKey: PropTypes.string,
    bootstrapURLKeys: PropTypes.any,
    height: PropTypes.any.isRequired,
    width: PropTypes.any.isRequired,
    defaultCenter: PropTypes.arrayOf(PropTypes.number.isRequired),
    center: PropTypes.arrayOf(PropTypes.number.isRequired),
    defaultZoom: PropTypes.number,
    zoom: PropTypes.number,
    onChange: PropTypes.func,
    onClick: PropTypes.func,
    onChildClick: PropTypes.func,
    onChildMouseDown: PropTypes.func,
    onChildMouseUp: PropTypes.func,
    onChildMouseMove: PropTypes.func,
    onChildMouseEnter: PropTypes.func,
    onChildMouseLeave: PropTypes.func,
    handleZoomChange: PropTypes.func,
    onZoomAnimationStart: PropTypes.func,
    onZoomAnimationEnd: PropTypes.func,
    onDrag: PropTypes.func,
    onMapTypeIdChange: PropTypes.func,
    onTilesLoaded: PropTypes.func,
    onGoogleApiLoaded: PropTypes.func,
    yesIWantToUseGoogleMapApiInternals: PropTypes.bool,
    draggable: PropTypes.bool,
    options: PropTypes.objectOf(PropTypes.any),
    distanceToMouse: PropTypes.func,
    hoverDistance: PropTypes.number,
    debounced: PropTypes.bool,
    margin: PropTypes.array,
    googleMapLoader: PropTypes.any,
    style: PropTypes.any,
    resetBoundsOnResize: PropTypes.bool,
    layerTypes: PropTypes.arrayOf(PropTypes.string.isRequired) // ['TransitLayer', 'TrafficLayer']
  }

  static defaultProps = {
    toggleKey: "", // Refreshes map instance if this changes
    height: "100%",
    width: "100%",
    center: CENTER_OF_US,
    defaultCenter: CENTER_OF_US,
    bounds: {
      nw: { lat: 46.55127582874266, lng: -129.69113235508883 },
      se: { lat: 14.509102613864272, lng: -92.95285110508881 },
      sw: { lat: 14.509102613864272, lng: -129.69113235508883 },
      ne: { lat: 46.55127582874266, lng: -92.95285110508881 }
    },
    zoom: DEFAULT_ZOOM,
    controls: [],
    locations: [],
    sites: [],
    locationsList: [],
    showMarkersMinZoom: DEFAULT_MARKER_MIN_ZOOM,
    showMarkersMaxZoom: DEFAULT_MARKER_MAX_ZOOM,
    showPolygonsMinZoom: DEFAULT_POLYGON_MIN_ZOOM,
    showPolygonsMaxZoom: DEFAULT_POLYGON_MAX_ZOOM,
    showParlayMinZoom: DEFAULT_PARLAY_MIN_ZOOM,
    showParlayMaxZoom: DEFAULT_PARLAY_MAX_ZOOM,
    useGoogleMapApi: true,
    drawingMode: false,
    shouldShowParlay: false,
    shouldFitCoordsToBounds: true,
    draggable: true,
    options: DEFAULT_MAP_OPTIONS,
    shouldRenderLocationList: false
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      height,
      width,
      defaultCenter,
      controls,
      center,
      zoom,
      bounds,
      sites,
      toggleKey,
      useGoogleMapApi,
      drawingMode,
      shouldShowParlay,
      draggable,
      locationsList,
      showMarkersMinZoom,
      showMarkersMaxZoom,
      showPolygonsMinZoom,
      showPolygonsMaxZoom,
      setHoveredChildKey,
      hoveredChildKey,
      item,
      shouldRenderLocationList
    } = nextProps

    const {
      zooming,
      mapApiLoaded,
      mapInstance,
      mapApi,
      shouldFitCoordsToBounds
    } = prevState
    const stateHoverChildKey = prevState.hoveredChildKey

    let { locations } = nextProps

    // if (filteredSites.length > 0) {
    //   // Remove locations that share the same boundaries in the sites
    //   locations = locations.filter(
    //     location =>
    //       location.boundaries.coordinates.filter(
    //         coord => !removeDuplicateCoordsMap[JSON.stringify(coord)]
    //       ).length > 0
    //   )
    // }

    const markers = formatLocations(locations)
    const markerClusters = createClusters(markers, { ...nextProps })

    const sitePolygons = formatLocations(sites)
    const polygonClusters = createClusters(sitePolygons, {
      ...nextProps
    }).concat(markerClusters)

    const shouldRenderMarkers = zoomWithinRange(
      showMarkersMinZoom,
      showMarkersMaxZoom,
      zoom
    )

    const shouldRenderPolygons = zooming
      ? false
      : zoomWithinRange(showPolygonsMinZoom, showPolygonsMaxZoom, zoom)

    return {
      height,
      width,
      defaultCenter,
      markerClusters,
      polygonClusters,
      sites,
      controls,
      center,
      zoom,
      bounds,
      toggleKey,
      useGoogleMapApi,
      drawingMode,
      shouldShowParlay,
      draggable,
      locationsList,
      shouldRenderMarkers,
      shouldRenderPolygons,
      shouldRenderLocationList,
      hoveredChildKey: setHoveredChildKey
        ? hoveredChildKey
        : stateHoverChildKey,
      mapApiLoaded,
      mapInstance,
      mapApi,
      shouldFitCoordsToBounds
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const propsChanged = !deepEquals(this.props, nextProps)
    const stateChanged = !deepEquals(this.state, nextState)

    return propsChanged || stateChanged
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    let newCoords = null

    const previousSites = prevState.sites
    const currentSites = this.state.sites

    const sitesChanged = !deepEquals(previousSites, currentSites)

    if (sitesChanged) {
      newCoords = currentSites.map(site =>
        site.boundary.map(b => {
          const [lat, lng] = b
          return { lat, lng }
        })
      )
    }

    return newCoords
  }

  componentDidUpdate(prevProps, prevState, newCoords) {
    if (newCoords) {
      const {
        shouldFitCoordsToBounds,
        mapInstance,
        mapApi,
        bounds
      } = this.state
      if (shouldFitCoordsToBounds && mapInstance && mapApi) {
        fitCoordsToBounds(mapInstance, mapApi, newCoords)
        this.setState({ shouldFitCoordsToBounds: false })
      }
    }
  }

  componentWillUnmount() {
    const { resetMap } = this.props

    // resetMap()
  }

  handleChange = ({ bounds, center, marginBounds, size, zoom }) => {
    const centerToArray = Object.values(center)
    // console.log('handleChange bounds: ', centerToArray)
    this.panTo({ center: centerToArray, zoom, bounds })
  }

  panTo = ({ center, zoom, bounds }) => {
    const { setMapCenterBoundsZoom } = this.props
    setMapCenterBoundsZoom({ center, zoom, bounds })
  }

  onClick = ({ event, lat, lng, x, y }) => {
    // console.log('onClick: ', lat, lng)
    this.handleFetchParlaySite(lat, lng)
  }

  onChildClick = id => {
    const { x, y, lat, lng } = this.mousePosRef
    // console.log('onChildClick: ', lat, lng)
    this.handleFetchParlaySite(lat, lng)
  }

  handleFetchParlaySite = (lat, lng) => {
    const { fetchParlaySite } = this.props
    const { shouldShowParlay, shouldRenderPolygons, drawingMode } = this.state
    if (shouldShowParlay && shouldRenderPolygons && !drawingMode) {
      fetchParlaySite(lat, lng)
    }
  }
  onChildMouseDown = e => {
    // console.log('onChildMouseDown: ', e)
  }
  onChildMouseUp = e => {
    // console.log('onChildMouseUp: ', e)
  }
  onChildMouseMove = e => {
    // console.log('onChildMouseMove: ', e)
  }
  onChildMouseEnter = key => {
    // console.log('onChildMouseEnter: ', key)
    const { setHoveredChildKey } = this.props
    if (setHoveredChildKey) setHoveredChildKey(key)
  }
  onChildMouseLeave = key => {
    // console.log('onChildMouseLeave: ', key)
    const { setHoveredChildKey } = this.props
    if (setHoveredChildKey) setHoveredChildKey("")
  }
  onZoomAnimationStart = () => {
    // console.log('onZoomAnimationStart')
    this.setState({ zooming: true })
  }
  onZoomAnimationEnd = () => {
    // console.log('onZoomAnimationEnd')
    this.setState({ zooming: false })
  }
  onDrag = map => {
    // console.log('onDrag: ', map)
  }
  onMapTypeIdChange = e => {
    // console.log('onMapTypeIdChange: ', e)
  }
  onTilesLoaded = () => {
    // console.log('onTilesLoaded')
  }

  distanceToMouse = (pointPos, mousePos) => {
    const { shouldRenderMarkers, shouldRenderPolygons } = this.state
    let markerX = 0
    let markerY = 0
    let mouseX = 0
    let mouseY = 0

    if (shouldRenderPolygons) {
      const { lat, lng } = pointPos
      markerX = lat
      markerY = lng
      mouseX = mousePos.lat
      mouseY = mousePos.lng
      // console.log('pointPos: ', pointPos.lat)
      // console.log('mousePos: ', mousePos.lat)

      // return 16.9
    } else if (shouldRenderMarkers) {
      const { x, y } = pointPos
      markerX = x
      markerY = y - K_STICK_SIZE - K_CIRCLE_SIZE / 2
      mouseX = mousePos.x
      mouseY = mousePos.y
    }

    const distanceKoef = 2

    const distanceToMouse =
      distanceKoef *
      Math.sqrt(
        (markerX - mouseX) * (markerX - mouseX) +
          (markerY - mouseY) * (markerY - mouseY)
      )

    // console.log('distanceToMouse: ', distanceToMouse)
    this.mousePosRef = mousePos

    return distanceToMouse
  }

  onGoogleApiLoaded = ({ map, maps }) => {
    const {
      shouldFitCoordsToBounds,
      shouldShowParlay,
      polygonClusters
    } = this.state

    this.setState({
      mapApiLoaded: true,
      mapInstance: map,
      mapApi: maps
    })

    if (shouldFitCoordsToBounds && polygonClusters.length > 0) {
      const coords = polygonClusters.map(cluster =>
        cluster.points.map(p => {
          const { boundary, boundaries } = p
          return boundary || boundaries
        })
      )

      fitCoordsToBounds(map, maps, coords)
    }
  }

  renderMarkerClusters = markerClusters => {
    const { setMapCenterBoundsZoom } = this.props
    const { shouldRenderMarkers, hoveredChildKey, zoom } = this.state
    if (!shouldRenderMarkers) return null
    else
      return markerClusters.map(item => {
        const { id, numPoints, points, ...props } = item
        if (numPoints === 1) {
          const { id, ...props } = points[0]
          return (
            <Marker
              {...props}
              key={id}
              hoveredChildKey={hoveredChildKey}
              setMapCenterBoundsZoom={setMapCenterBoundsZoom}
              zoom={zoom}
            />
          )
        } else
          return (
            <MarkerCluster
              {...props}
              key={id}
              points={points}
              hoveredChildKey={hoveredChildKey}
              setMapCenterBoundsZoom={setMapCenterBoundsZoom}
              zoom={zoom}
            />
          )
      })
  }

  renderPolygons = polygonClusters => {
    const {
      shouldRenderPolygons,
      drawingMode,
      bounds,
      mapInstance,
      mapApi,
      hoveredChildKey
    } = this.state
    if (!shouldRenderPolygons || drawingMode || !mapInstance) {
      return null
    } else {
      const { heading, tilt } = mapInstance
      return polygonClusters.map((cluster, i) => {
        const { id, lat, lng, numPoints, points } = cluster

        return points.map(point => {
          const { id, _id, boundary, lat, lng, boundaries, ...props } = point
          const key = `${_id || id}`
          return (
            <PolygonSystem
              {...props}
              key={key}
              lat={bounds.ne.lat}
              lng={bounds.nw.lng}
              center={[lat, lng]}
              bounds={bounds}
              coords={boundary || boundaries}
              heading={heading}
              tilt={tilt}
              hoveredChildKey={hoveredChildKey}
              maps={mapApi}
            />
          )
        })
      })
    }
  }

  renderDrawingManager = (height, width) => {
    const { toggleDrawingMode } = this.props
    const { mapApi, shouldRenderPolygons, drawingMode, bounds } = this.state
    const { mousePosRef } = this
    return (
      mapApi &&
      drawingMode && (
        <DrawingManager
          key="drawingManager"
          lat={bounds.ne.lat}
          lng={bounds.nw.lng}
          bounds={bounds}
          mousePos={mousePosRef}
          toggleDrawingMode={toggleDrawingMode}
          shouldRenderPolygons={shouldRenderPolygons}
          height={height}
          width={width}
          mapApi={mapApi}
        />
      )
    )
  }

  getMapControls = () => {
    const {
      activeProject: {
        item: { id }
      },
      sites
    } = this.props

    const hasUserDefinedSite = sites.find(
      site => site.siteType === "USER_DEFINED" && site._attached
    )
    const shouldRenderParlayMapButton = id && !hasUserDefinedSite
    const shouldShowDrawingModeButton =
      shouldRenderParlayMapButton &&
      sites.filter(site => site._attached).length === 0

    const TIME_TO_WAIT_FOR_DRAWING_MANAGER_TO_MOUNT = 1000

    const mapControls = [
      {
        controlPosition: GOOGLE_MAP_CONTROL_POSITIONS.TOP_CENTER,
        items: [
          {
            Component: MapSearchBox
          }
        ]
      },
      {
        controlPosition: GOOGLE_MAP_CONTROL_POSITIONS.BOTTOM_LEFT,
        items: [
          {
            Component: ParlayMapButton,
            onClick: this.toggleParlayMapRender,
            disabled: !shouldRenderParlayMapButton
          },
          {
            Component: DrawButton,
            onClick: () => {
              this.toggleParlayMapRender()
              setTimeout(
                () => this.toggleDrawingMode(),
                TIME_TO_WAIT_FOR_DRAWING_MANAGER_TO_MOUNT
              )
            },
            disabled: !shouldShowDrawingModeButton
          }
        ]
      },
      {
        controlPosition: GOOGLE_MAP_CONTROL_POSITIONS.RIGHT_BOTTOM,
        items: [
          {
            Component: RecenterZoomButton
          }
        ]
      }
    ]

    const parlayMapControls = [
      {
        controlPosition: GOOGLE_MAP_CONTROL_POSITIONS.BOTTOM_LEFT,
        items: [
          {
            Component: DrawButton,
            onClick: this.toggleDrawingMode,
            disabled: !shouldShowDrawingModeButton
          }
        ]
      },
      {
        controlPosition: GOOGLE_MAP_CONTROL_POSITIONS.TOP_RIGHT,
        items: [{ Component: CloseButton, onClick: this.toggleParlayMapRender }]
      }
    ]

    return {
      mapControls,
      parlayMapControls
    }
  }

  renderControls = controls => {
    const { mapInstance, mapApi } = this.state
    if (!mapInstance) return null
    return controls.map((control, i) => {
      const { controlPosition, items } = control
      return (
        <MapControl
          key={i}
          map={mapInstance}
          mapApi={mapApi}
          controlPosition={controlPosition}
          {...this.props}
        >
          {items.map((control, j) => {
            const { Component, ...props } = control
            return <Component {...props} key={j} />
          })}
        </MapControl>
      )
    })
  }

  render() {
    const { showPolygonsMinZoom, toggleDrawingMode } = this.props
    const {
      height,
      width,
      defaultCenter,
      sites,
      markerClusters,
      polygonClusters,
      locationsList,
      center,
      zoom,
      toggleKey,
      useGoogleMapApi,
      options,
      draggable,
      hoveredChildKey,
      controls,
      drawingMode,
      shouldRenderLocationList
    } = this.state

    return (
      <div
        style={{
          height,
          width,
          display: "flex"
        }}
      >
        {shouldRenderLocationList && (
          <div style={styles(shouldRenderLocationList).LocationListWrapper}>
            <LocationList
              defaultCenter={defaultCenter}
              clientsListItems={locationsList}
              projectListItems={markerClusters}
              sites={sites}
              hoveredChildKey={hoveredChildKey}
              onChildMouseEnter={this.onChildMouseEnter}
              onChildMouseLeave={this.onChildMouseLeave}
              showPolygonsMinZoom={showPolygonsMinZoom}
              toggleDrawingMode={toggleDrawingMode}
            />
          </div>
        )}
        <div
          style={styles(shouldRenderLocationList).GoogleMapWrapper}
          className={drawingMode ? "CursorStyle" : ""}
        >
          <GoogleMap
            ref={ref => (this.mapRef = ref)}
            key={toggleKey}
            bootstrapURLKeys={{ key: GOOGLE_KEY }}
            defaultCenter={defaultCenter}
            initialCenter={center}
            center={center}
            zoom={zoom}
            onChange={this.handleChange}
            onClick={this.onClick}
            onChildClick={this.onChildClick}
            onChildMouseDown={this.onChildMouseDown}
            onChildMouseUp={this.onChildMouseUp}
            onChildMouseMove={this.onChildMouseMove}
            onChildMouseEnter={this.onChildMouseEnter}
            onChildMouseLeave={this.onChildMouseLeave}
            onZoomAnimationStart={this.onZoomAnimationStart}
            onZoomAnimationEnd={this.onZoomAnimationEnd}
            onDrag={this.onDrag}
            onMapTypeIdChange={this.onMapTypeIdChange}
            onTilesLoaded={this.onTilesLoaded}
            onGoogleApiLoaded={this.onGoogleApiLoaded}
            yesIWantToUseGoogleMapApiInternals={useGoogleMapApi}
            options={options}
            hoverDistance={K_CIRCLE_SIZE / 2}
            distanceToMouse={this.distanceToMouse}
            draggable={draggable}
          >
            {this.renderDrawingManager(height, width)}
            {this.renderPolygons(polygonClusters)}
            {this.renderMarkerClusters(markerClusters)}
            {this.renderControls(controls)}
          </GoogleMap>
        </div>
      </div>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(RadiusMap)
