import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import GoogleMapReact from "google-map-react"
import MarkerCluster from "../RadiusMap/MarkerCluster"
import Marker from "../RadiusMap/Marker"
import { WatchUserLocation } from "../../actions/User"
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

    const { defaultCenter, zoom } = props

    this.state = { center: defaultCenter, mapApiLoaded: false, zoom }
  }

  static propTypes = {
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    WatchUserLocation: PropTypes.func.isRequired,
    onChangeCallback: PropTypes.func,
    locations: PropTypes.arrayOf(PropTypes.object)
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
    locations: []
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let {
      renderUserLocation,
      UserLocation,

      latitude,
      longitude,
      locations
    } = nextProps

    let markerClusters = []

    const { center, bounds, zoom } = prevState

    const formattedLocations = formatLocations(locations)

    if (center && zoom && bounds) {
      markerClusters = createClusters(formattedLocations, {
        center,
        bounds,
        zoom
      })
    }

    if (latitude && longitude) {
      // Remove possible trailing zeroes
      latitude = parseFloat(latitude.toString())
      longitude = parseFloat(longitude.toString())
    }

    const shouldRenderEntryLocation = latitude && longitude

    const shouldRenderUserLocation =
      renderUserLocation && UserLocation.latitude && UserLocation.longitude

    return {
      renderUserLocation,
      UserLocation,
      center,
      zoom,
      latitude,
      longitude,
      shouldRenderEntryLocation,
      shouldRenderUserLocation,
      markerClusters,
      formattedLocations
    }
  }

  onGoogleApiLoaded = ({ map, maps }) => {
    const { UserLocation, latitude, longitude, formattedLocations } = this.state

    this.setState({
      mapApiLoaded: true,
      mapInstance: map,
      mapApi: maps
    })

    let coords = []

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
    const { onChangeCallback } = this.props
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
          />
        )
      } else {
        return (
          <MarkerCluster
            {...props}
            key={id}
            points={points}
            zoom={zoom}
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
      children,
      onChangeCallback
    } = this.props
    const {
      center,
      zoom,
      latitude,
      longitude,
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
              key={1}
              lat={latitude}
              lng={longitude}
              renderUserLocation={false}
              onChangeCallback={onChangeCallback}
            />
          )}
          {shouldRenderUserLocation && (
            <Marker
              key={2}
              lat={UserLocation.latitude}
              lng={UserLocation.longitude}
              renderUserLocation={renderUserLocation}
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
