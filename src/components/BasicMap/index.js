import React, { PureComponent, Fragment } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import GoogleMapReact from "google-map-react"
import Marker from "../RadiusMap/Marker"
import { WatchUserLocation } from "../../actions/User"
import { DEFAULT_MAP_OPTIONS } from "../RadiusMap/constants"

const { REACT_APP_GOOGLE_LOCATION_API } = process.env

const mapStateToProps = ({ User: { location } }) => ({ UserLocation: location })

const mapDispatchToProps = { WatchUserLocation }

class BasicMap extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    latitude: PropTypes.number,
    longitude: PropTypes.number
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
      center,
      zoom,
      latitude,
      longitude
    } = nextProps

    if (latitude && longitude) {
      zoom = 16
      // Remove possible trailing zeroes
      latitude = parseFloat(latitude.toString())
      longitude = parseFloat(longitude.toString())
      center = {
        lat: latitude,
        lng: longitude
      }
    } else if (renderUserLocation) {
      zoom = 16
      latitude = UserLocation.latitude
      longitude = UserLocation.longitude
      center = {
        lat: UserLocation.latitude,
        lng: UserLocation.longitude
      }
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
  
    return (
      <div style={{ height, width }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: REACT_APP_GOOGLE_LOCATION_API }}
          defaultCenter={defaultCenter}
          defaultZoom={defaultZoom}
          center={center}
          zoom={zoom}
          options={options}
        >
          {this.renderMarker()}
          {children}
        </GoogleMapReact>
      </div>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(BasicMap)
