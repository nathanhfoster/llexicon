import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { connect } from "store/provider"
import GoogleMapReact from "google-map-react"
import MarkerCluster from "./MarkerCluster"
import Marker from "./Marker"
import { SetMapBoundsCenterZoom } from "reducers//Map/actions"
import { WatchUserLocation } from "reducers//User/actions"

import { DEFAULT_MAP_OPTIONS, GOOGLE_MAP_CONTROL_POSITIONS } from "./constants"
import MapControl from "./MapControl"
import MapSearchBox from "./MapControl/Controls/MapSearchBox"
import UserLocationButton from "./MapControl/Controls/Buttons/UserLocationButton"
import createClusters from "./functions/createClusters"
import formatLocations from "./functions/formatLocations"
import { EntryPropTypes } from "reducers//Entries/propTypes"

const { REACT_APP_GOOGLE_LOCATION_API } = process.env

const mapStateToProps = ({
  Map: { bounds, center, zoom },
  User: { location },
}) => ({ bounds, center, zoom, UserLocation: location })

const mapDispatchToProps = { SetMapBoundsCenterZoom, WatchUserLocation }

class BasicMap extends PureComponent {
  static propTypes = {
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    SetMapBoundsCenterZoom: PropTypes.func.isRequired,
    WatchUserLocation: PropTypes.func.isRequired,
    onChangeCallback: PropTypes.func.isRequired,
    locations: PropTypes.arrayOf(PropTypes.object),
    getAddressOnMarkerClick: PropTypes.bool.isRequired,
    entry: EntryPropTypes,
  }

  static defaultProps = {
    renderUserLocation: true,
    height: 500,
    width: "100%",
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

    // console.log("bounds: ", bounds)
    // console.log("center: ", center)
    // console.log("marginBounds: ", marginBounds)
    // console.log("size: ", size)
    // console.log("zoom: ", zoom)
    this.panTo(boundsCenterZoom)
  }

  panTo = (boundsCenterZoom) => {
    const { SetMapBoundsCenterZoom } = this.props
    if (
      boundsCenterZoom.bounds &&
      !(boundsCenterZoom.bounds.ne.lat && boundsCenterZoom.bounds.sw.lat)
    ) {
      delete boundsCenterZoom.bounds
    }

    SetMapBoundsCenterZoom(boundsCenterZoom)
  }

  getMapControls = () => {
    const { onChangeCallback, UserLocation, WatchUserLocation } = this.props

    const mapControls = [
      {
        controlPosition: GOOGLE_MAP_CONTROL_POSITIONS.TOP_LEFT,
        props: { width: "calc(100% - 48px)", onChangeCallback },
        items: [
          {
            Component: MapSearchBox,
          },
        ],
      },
      {
        controlPosition: GOOGLE_MAP_CONTROL_POSITIONS.RIGHT_BOTTOM,
        props: {
          width: "auto",
          UserLocation,
          WatchUserLocation,
          panTo: this.panTo,
        },
        items: [
          {
            Component: UserLocationButton,
          },
        ],
      },
    ]

    return mapControls
  }

  renderControls = (controls) => {
    const { mapInstance, mapApi } = this.state
    if (!mapInstance) return null
    return controls.map((control, i) => {
      const { controlPosition, items, props } = control
      const handlePanTo = (boundsCenterZoom) => this.panTo(boundsCenterZoom)

      return (
        <MapControl
          key={i}
          map={mapInstance}
          mapApi={mapApi}
          controlPosition={controlPosition}
          panTo={handlePanTo}
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

  renderMarkerClusters = (markerClusters) => {
    const { onChangeCallback, getAddressOnMarkerClick, zoom } = this.props
    const { mapInstance } = this.state
    if (!mapInstance) {
      return null
    }
    return markerClusters.map((item) => {
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
      center,
      zoom,
      height,
      width,
      options,
      onChangeCallback,
      renderUserLocation,
      getAddressOnMarkerClick,
      UserLocation,
    } = this.props
    const { entry, markerClusters } = this.state

    const mapControls = this.getMapControls()

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
        </GoogleMapReact>
      </div>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(BasicMap)
