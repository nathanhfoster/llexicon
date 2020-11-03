import React, { Fragment, PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import GoogleMapReact from 'google-map-react'
import MarkerCluster from './MarkerCluster'
import Marker from './Marker'
import { SetMapBoundsCenterZoom } from 'redux/Map/actions'
import { WatchUserLocation } from 'redux/User/actions'

import { DEFAULT_MAP_OPTIONS, GOOGLE_MAP_CONTROL_POSITIONS } from './constants'
import MapControl from './MapControl'
import MapSearchBox from './MapControl/Controls/MapSearchBox'
import UserLocationButton from './MapControl/Controls/Buttons/UserLocationButton'
import createClusters from './functions/createClusters'
import formatLocations from './functions/formatLocations'
import { EntryPropTypes } from 'redux/Entries/propTypes'

const { REACT_APP_GOOGLE_LOCATION_API } = process.env

const mapStateToProps = ({ Map: { bounds, center, zoom }, User: { location } }) => ({
  bounds,
  center,
  zoom,
  UserLocation: location,
})

const mapDispatchToProps = { SetMapBoundsCenterZoom, WatchUserLocation }

class BasicMap extends PureComponent {
  state = {}
  static propTypes = {
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    SetMapBoundsCenterZoom: PropTypes.func.isRequired,
    WatchUserLocation: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    locations: PropTypes.arrayOf(PropTypes.object),
    getAddressOnMarkerClick: PropTypes.bool.isRequired,
    entry: EntryPropTypes,
  }

  static defaultProps = {
    renderUserLocation: true,
    height: 500,
    width: '100%',
    options: DEFAULT_MAP_OPTIONS,
    locations: [],
    getAddressOnMarkerClick: false,
    entry: {},
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { bounds, zoom, locations } = nextProps

    let { center, entry } = nextProps

    let markerClusters = []

    const formattedLocations = formatLocations(locations)

    center.lat = parseFloat(center.lat)
    center.lng = parseFloat(center.lng)

    if (center && zoom && bounds) {
      markerClusters = createClusters(formattedLocations, {
        center,
        bounds,
        zoom,
      })
    }

    if (entry.latitude && entry.longitude) {
      // Remove possible trailing zeroes
      entry.latitude = parseFloat(entry.latitude.toString())
      entry.longitude = parseFloat(entry.longitude.toString())
    }

    return {
      entry,
      markerClusters,
      formattedLocations,
    }
  }

  onGoogleApiLoaded = ({ map, maps }) => {
    this.setState({
      mapInstance: map,
      mapApi: maps,
    })
  }

  handleChange = ({ bounds, center, marginBounds, size, zoom }) => {
    const boundsCenterZoom = { center, zoom, bounds }

    this.panTo(boundsCenterZoom)
  }

  panTo = boundsCenterZoom => {
    const { SetMapBoundsCenterZoom } = this.props
    if (
      boundsCenterZoom.bounds &&
      !(boundsCenterZoom.bounds.ne.lat && boundsCenterZoom.bounds.sw.lat)
    ) {
      delete boundsCenterZoom.bounds
    }

    SetMapBoundsCenterZoom(boundsCenterZoom)
  }

  renderMarkerClusters = markerClusters => {
    const { onChange, getAddressOnMarkerClick, zoom } = this.props
    const { mapInstance } = this.state
    if (!mapInstance) {
      return null
    }
    return markerClusters.map(item => {
      const { id, numPoints, points, ...props } = item
      if (numPoints === 1) {
        const { id, ...props } = points[0]
        return (
          <Marker
            {...props}
            key={id}
            zoom={zoom}
            onChange={onChange}
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
            onChange={onChange}
          />
        )
      }
    })
  }

  render() {
    const {
      center,
      zoom,
      height,
      width,
      options,
      onChange,
      renderUserLocation,
      getAddressOnMarkerClick,
      UserLocation,
    } = this.props
    const { entry, markerClusters, mapInstance, mapApi } = this.state

    const shouldRenderEntryLocation = entry.latitude && entry.longitude

    const shouldRenderUserLocation =
      renderUserLocation && UserLocation.latitude && UserLocation.longitude

    return (
      <div style={{ height, width }}>
        <GoogleMapReact
          // debounced
          bootstrapURLKeys={{ key: REACT_APP_GOOGLE_LOCATION_API }}
          // defaultCenter={center}
          // defaultZoom={zoom}
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
              onChange={onChange}
            />
          )}
          {shouldRenderUserLocation && (
            <Marker
              key='MyLocation'
              lat={UserLocation.latitude}
              lng={UserLocation.longitude}
              renderUserLocation={renderUserLocation}
              getAddressOnMarkerClick={getAddressOnMarkerClick}
              onChange={onChange}
            />
          )}
          {this.renderMarkerClusters(markerClusters)}
          {mapInstance && (
            <Fragment>
              <MapControl
                map={mapInstance}
                mapApi={mapApi}
                controlPosition={GOOGLE_MAP_CONTROL_POSITIONS.TOP_LEFT}
                panTo={this.panTo}
              >
                <MapSearchBox width='calc(100% - 48px)' onChange={onChange} />
              </MapControl>
              <MapControl
                width='auto'
                map={mapInstance}
                mapApi={mapApi}
                controlPosition={GOOGLE_MAP_CONTROL_POSITIONS.RIGHT_BOTTOM}
                panTo={this.panTo}
              >
                <UserLocationButton
                  UserLocation={UserLocation}
                  WatchUserLocation={WatchUserLocation}
                />
              </MapControl>
            </Fragment>
          )}
        </GoogleMapReact>
      </div>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(BasicMap)
