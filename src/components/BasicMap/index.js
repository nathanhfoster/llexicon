import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import GoogleMapReact from "google-map-react"
import Marker from "../Map/Marker"
import { WatchUserLocation } from "../../actions/User"

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
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
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
    defaultZoom: 3,
    zoom: 3
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let { renderUserLocation, UserLocation, center, zoom } = nextProps

    if (renderUserLocation) {
      center = {
        lat: UserLocation.latitude,
        lng: UserLocation.longitude
      }
      zoom = 11
    }

    return { renderUserLocation, UserLocation, center, zoom }
  }

  render() {
    const { height, width, defaultCenter, defaultZoom, children } = this.props
    const { renderUserLocation, UserLocation, center, zoom } = this.state
    return (
      <div style={{ height, width }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: REACT_APP_GOOGLE_LOCATION_API }}
          defaultCenter={defaultCenter}
          defaultZoom={defaultZoom}
          center={center}
          zoom={zoom}
        >
          {renderUserLocation && (
            <Marker
              lat={UserLocation.latitude}
              lng={UserLocation.longitude}
              text="My Marker"
            />
          )}
          {children}
        </GoogleMapReact>
      </div>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(BasicMap)
