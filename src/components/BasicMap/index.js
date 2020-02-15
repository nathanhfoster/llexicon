import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import GoogleMapReact from "google-map-react"
import MarkerCluster from "../RadiusMap/MarkerCluster"
import Marker from "../RadiusMap/Marker"
import { WatchUserLocation } from "../../redux/User/actions"
import {
  DEFAULT_MAP_OPTIONS,
  GOOGLE_MAP_CONTROL_POSITIONS
} from "../RadiusMap/constants"
import MapControl from "../RadiusMap/MapControl"
import fitCoordsToBounds from "../RadiusMap/functions/fitCoordsToBounds"
import MapSearchBox from "../RadiusMap/MapControl/Controls/MapSearchBox"
import RecenterZoomButton from "../RadiusMap/MapControl/Controls/Buttons/RecenterZoomButton"
import createClusters from "./functions/createClusters"
import formatLocations from "./functions/formatLocations"

const { REACT_APP_GOOGLE_LOCATION_API } = process.env

const mapStateToProps = ({ User: { location } }) => ({ UserLocation: location })

const mapDispatchToProps = { WatchUserLocation }

class BasicMap extends PureComponent {
  constructor(props) {
    super(props)

    let { defaultCenter, zoom } = props

    this.state = {
      center: defaultCenter,
      mapApiLoaded: false,
      zoom
    }
  }

  static propTypes = {
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    WatchUserLocation: PropTypes.func.isRequired,
    onChangeCallback: PropTypes.func.isRequired,
    locations: PropTypes.arrayOf(PropTypes.object),
    getAddressOnMarkerClick: PropTypes.bool.isRequired,
    entry: PropTypes.object
  }

  static defaultProps = {
    renderUserLocation: true,
    height: 500,
    width: "100%",
    defaultCenter: {
      lat: 39.8097343,
      lng: -98.5556199
    },
    center: {
      lat: 39.8097343,
      lng: -98.5556199
    },
    defaultZoom: 18,
    zoom: 18,
    options: DEFAULT_MAP_OPTIONS,
    locations: [],
    getAddressOnMarkerClick: false,
    entry: {}
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let { entry, renderUserLocation, UserLocation, locations } = nextProps

    let markerClusters = []

    const { center, bounds, zoom, mapInstance, mapApi } = prevState

    const formattedLocations = formatLocations(locations)

    if (center && zoom && bounds) {
      markerClusters = createClusters(formattedLocations, {
        center,
        bounds,
        zoom
      })
    }

    if (entry.latitude && entry.longitude) {
      // Remove possible trailing zeroes
      entry.latitude = parseFloat(entry.latitude.toString())
      entry.longitude = parseFloat(entry.longitude.toString())
    }

    const shouldRenderEntryLocation = entry.latitude && entry.longitude

    const shouldRenderUserLocation =
      renderUserLocation && UserLocation.latitude && UserLocation.longitude

    return {
      entry,
      renderUserLocation,
      UserLocation,
      center,
      zoom,
      mapInstance,
      mapApi,
      shouldRenderEntryLocation,
      shouldRenderUserLocation,
      markerClusters,
      formattedLocations
    }
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    const previousUserLocation = prevState.UserLocation
    const { UserLocation, mapInstance, mapApi } = this.state

    const recievedUserLocation =
      mapInstance &&
      mapApi &&
      previousUserLocation.latitude === null &&
      previousUserLocation.longitude === null &&
      UserLocation.latitude &&
      UserLocation.longitude

    if (recievedUserLocation) {
      return true
    }

    return null
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { mapInstance, mapApi } = this.state
    if (snapshot) {
      this.handleFitCoordsToBounds(mapInstance, mapApi)
    }
  }

  onGoogleApiLoaded = ({ map, maps }) => {
    this.setState({
      mapApiLoaded: true,
      mapInstance: map,
      mapApi: maps
    })
    this.handleFitCoordsToBounds(map, maps)
  }

  handleFitCoordsToBounds = (map, maps) => {
    if (!(map || maps)) {
      return
    }
    let coords = []
    const {
      UserLocation,
      entry: { latitude, longitude },
      formattedLocations
    } = this.state
    if (latitude && longitude) {
      coords.push({ lat: latitude, lng: longitude })
    }

    if (UserLocation.latitude && UserLocation.longitude) {
      coords.push({ lat: UserLocation.latitude, lng: UserLocation.longitude })
    }

    for (let i = 0; i < formattedLocations.length; i++) {
      const { lat, lng } = formattedLocations[i]

      coords.push({ lat, lng })
    }

    fitCoordsToBounds(map, maps, coords)
  }

  handleChange = ({ bounds, center, marginBounds, size, zoom }) => {
    // const centerToArray = Object.values(center)
    // console.log('handleChange bounds: ', centerToArray)
    this.panTo({ center, zoom, bounds })
  }

  panTo = ({
    center = this.state.center,
    zoom = this.state.zoom,
    bounds = this.state.bounds
  }) => {
    this.setState({ center, zoom, bounds })
  }

  getMapControls = () => {
    const mapControls = [
      {
        controlPosition: GOOGLE_MAP_CONTROL_POSITIONS.TOP_LEFT,
        props: { width: "calc(100% - 48px)" },
        items: [
          {
            Component: MapSearchBox
          }
        ]
      },
      {
        controlPosition: GOOGLE_MAP_CONTROL_POSITIONS.RIGHT_BOTTOM,
        props: { width: "auto" },
        items: [
          {
            Component: RecenterZoomButton
          }
        ]
      }
    ]

    return mapControls
  }

  renderControls = controls => {
    const { mapInstance, mapApi } = this.state
    if (!mapInstance) return null
    return controls.map((control, i) => {
      const { controlPosition, items, props } = control
      return (
        <MapControl
          key={i}
          map={mapInstance}
          mapApi={mapApi}
          controlPosition={controlPosition}
          panTo={({ center, zoom, bounds }) =>
            this.panTo({ center, zoom, bounds })
          }
          {...this.props}
          {...props}
        >
          {items.map((control, j) => {
            const { Component, ...props } = control
            return <Component {...props} key={j} />
          })}
        </MapControl>
      )
    })
  }

  renderMarkerClusters = markerClusters => {
    const { onChangeCallback, getAddressOnMarkerClick } = this.props
    const { zoom } = this.state
    return markerClusters.map(item => {
      const { id, numPoints, points, ...props } = item
      if (numPoints === 1) {
        const { id, ...props } = points[0]
        return (
          <Marker
            {...props}
            key={id}
            zoom={zoom}
            onChangeCallback={onChangeCallback}
            getAddressOnMarkerClick={getAddressOnMarkerClick}
          />
        )
      } else {
        return (
          <MarkerCluster
            {...props}
            key={id}
            points={points}
            zoom={zoom}
            getAddressOnMarkerClick={getAddressOnMarkerClick}
            onChangeCallback={onChangeCallback}
          />
        )
      }
    })
  }

  render() {
    const {
      height,
      width,
      defaultCenter,
      defaultZoom,
      options,
      onChangeCallback,
      getAddressOnMarkerClick,
      children
    } = this.props
    const {
      entry,
      center,
      zoom,
      renderUserLocation,
      UserLocation,
      shouldRenderEntryLocation,
      shouldRenderUserLocation,
      markerClusters
    } = this.state
    const mapControls = this.getMapControls()

    return (
      <div style={{ height, width }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: REACT_APP_GOOGLE_LOCATION_API }}
          defaultCenter={defaultCenter}
          defaultZoom={defaultZoom}
          center={center}
          zoom={zoom}
          onChange={this.handleChange}
          options={options}
          onGoogleApiLoaded={this.onGoogleApiLoaded}
          yesIWantToUseGoogleMapApiInternals={true}
        >
          {shouldRenderEntryLocation && (
            <Marker
              {...entry}
              key={entry.id}
              lat={entry.latitude}
              lng={entry.longitude}
              renderUserLocation={false}
              getAddressOnMarkerClick={getAddressOnMarkerClick}
              onChangeCallback={onChangeCallback}
            />
          )}
          {shouldRenderUserLocation && (
            <Marker
              key="MyLocation"
              lat={UserLocation.latitude}
              lng={UserLocation.longitude}
              renderUserLocation={renderUserLocation}
              getAddressOnMarkerClick={getAddressOnMarkerClick}
              onChangeCallback={onChangeCallback}
            />
          )}
          {this.renderMarkerClusters(markerClusters)}
          {this.renderControls(mapControls)}
          {children}
        </GoogleMapReact>
      </div>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(BasicMap)
