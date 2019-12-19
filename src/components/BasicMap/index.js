import React, { PureComponent, Fragment } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import GoogleMapReact from "google-map-react"
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

const { REACT_APP_GOOGLE_LOCATION_API } = process.env

const mapStateToProps = ({ User: { location } }) => ({ UserLocation: location })

const mapDispatchToProps = { WatchUserLocation }

class BasicMap extends PureComponent {
  constructor(props) {
    super(props)

    const { defaultCenter } = props

    this.state = { center: defaultCenter, mapApiLoaded: false }
  }

  static propTypes = {
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    WatchUserLocation: PropTypes.func.isRequired,
    onChangeCallback: PropTypes.func
  }

  static defaultProps = {
    renderUserLocation: false,
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
    options: DEFAULT_MAP_OPTIONS
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let {
      renderUserLocation,
      UserLocation,
      zoom,
      latitude,
      longitude
    } = nextProps

    const { center } = prevState

    if (latitude && longitude) {
      zoom = 16
      // Remove possible trailing zeroes
      latitude = parseFloat(latitude.toString())
      longitude = parseFloat(longitude.toString())
    } else if (renderUserLocation) {
      zoom = 16
      latitude = UserLocation.latitude
      longitude = UserLocation.longitude
    }

    return {
      renderUserLocation,
      UserLocation,
      center,
      zoom,
      latitude,
      longitude
    }
  }

  onGoogleApiLoaded = ({ map, maps }) => {
    const { UserLocation, latitude, longitude } = this.state

    this.setState({
      mapApiLoaded: true,
      mapInstance: map,
      mapApi: maps
    })

    const coords = [
      { lat: latitude, lng: longitude },
      { lat: UserLocation.latitude, lng: UserLocation.longitude }
    ]
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

  renderMarker = () => {
    const { latitude, longitude, renderUserLocation, UserLocation } = this.state

    const shouldRenderMarker = latitude && longitude

    return (
      shouldRenderMarker && [
        <Marker
          key={1}
          lat={latitude}
          lng={longitude}
          text="My Location"
          renderUserLocation={false}
        />,
        <Marker
          key={2}
          lat={UserLocation.latitude}
          lng={UserLocation.longitude}
          text="My Location"
          renderUserLocation={renderUserLocation}
        />
      ]
    )
  }

  render() {
    const {
      height,
      width,
      defaultCenter,
      defaultZoom,
      options,
      children
    } = this.props
    const { center, zoom } = this.state
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
          {this.renderMarker()}
          {this.renderControls(mapControls)}
          {children}
        </GoogleMapReact>
      </div>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(BasicMap)
