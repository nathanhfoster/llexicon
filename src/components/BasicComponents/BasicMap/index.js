import React, { useState, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import GoogleMapReact from 'google-map-react'
import MarkerCluster from './MarkerCluster'
import Marker from './Marker'
import { SetMapBoundsCenterZoom } from 'redux/Map/actions'
import { SetUserLocation } from 'redux/User/actions'
import useMapControl from './Controls/useMapControl'
import MapSearchBox from './Controls/MapSearchBox'
import UserLocationButton from './Controls/Buttons/UserLocationButton'
import createClusters from './functions/createClusters'
import formatLocations from './functions/formatLocations'
import { EntryPropTypes } from 'redux/Entries/propTypes'
import { DEFAULT_MAP_OPTIONS, GOOGLE_MAP_CONTROL_POSITIONS } from './constants'

const { REACT_APP_GOOGLE_LOCATION_API } = process.env

const mapStateToProps = ({ Map: { bounds, center, zoom }, User: { location } }) => ({
  bounds,
  center,
  zoom,
  UserLocation: location,
})

const mapDispatchToProps = { SetMapBoundsCenterZoom, SetUserLocation }

const BasicMap = ({
  entry,
  center,
  bounds,
  locations,
  zoom,
  height,
  width,
  options,
  onChange,
  renderUserLocation,
  getAddressOnMarkerClick,
  UserLocation,
  SetUserLocation,
  SetMapBoundsCenterZoom,
}) => {
  const [state, setState] = useState({
    mapInstance: null,
    mapApi: null,
    mapRef: null,
  })

  const { mapInstance, mapApi, mapRef } = state

  const formattedLocations = useMemo(() => formatLocations(locations), [locations])

  center.lat = parseFloat(center.lat)
  center.lng = parseFloat(center.lng)

  const markerClusters = useMemo(() => {
    let clusters = []
    if (center && zoom && bounds) {
      clusters = createClusters(formattedLocations, {
        center,
        bounds,
        zoom,
      })
    }

    return clusters
  }, [bounds, center, formattedLocations, zoom])

  if (entry.latitude && entry.longitude) {
    // Remove possible trailing zeroes
    entry.latitude = parseFloat(entry.latitude.toString())
    entry.longitude = parseFloat(entry.longitude.toString())
  }

  const onGoogleApiLoaded = useCallback(({ map, maps, ref }) => {
    if (!mapInstance) {
      setState(prevState => ({
        ...prevState,
        mapInstance: map,
        mapApi: maps,
        mapRef: ref,
      }))
    }
  }, [])

  const panTo = useCallback(
    boundsCenterZoom => {
      if (
        boundsCenterZoom.bounds &&
        !(boundsCenterZoom.bounds.ne.lat && boundsCenterZoom.bounds.sw.lat)
      ) {
        delete boundsCenterZoom.bounds
      }

      SetMapBoundsCenterZoom(boundsCenterZoom)
    },
    [SetMapBoundsCenterZoom],
  )

  const handleChange = useCallback(
    ({ bounds, center, marginBounds, size, zoom }) => {
      const boundsCenterZoom = { center, zoom, bounds }

      panTo(boundsCenterZoom)
    },
    [panTo],
  )

  const renderMarkerClusters = useMemo(() => {
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
  }, [getAddressOnMarkerClick, mapInstance, markerClusters, onChange, zoom])

  const shouldRenderEntryLocation = entry.latitude && entry.longitude

  const shouldRenderUserLocation =
    renderUserLocation && UserLocation.latitude && UserLocation.longitude

  useMapControl({
    map: mapInstance,
    controlPosition: GOOGLE_MAP_CONTROL_POSITIONS.TOP_LEFT,
    children: <MapSearchBox mapApi={mapApi} panTo={panTo} onChange={onChange} />,
    width: 'calc(100% - 48px)',
  })

  useMapControl({
    map: mapInstance,
    controlPosition: GOOGLE_MAP_CONTROL_POSITIONS.RIGHT_BOTTOM,
    children: <UserLocationButton panTo={panTo} SetUserLocation={SetUserLocation} />,
  })

  return (
    <div style={{ height, width }}>
      <GoogleMapReact
        // debounced
        bootstrapURLKeys={{ key: REACT_APP_GOOGLE_LOCATION_API }}
        // defaultCenter={center}
        // defaultZoom={zoom}
        center={center}
        zoom={zoom}
        onChange={handleChange}
        options={options}
        onGoogleApiLoaded={onGoogleApiLoaded}
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
        {renderMarkerClusters}
      </GoogleMapReact>
    </div>
  )
}

BasicMap.propTypes = {
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  SetMapBoundsCenterZoom: PropTypes.func.isRequired,

  onChange: PropTypes.func.isRequired,
  locations: PropTypes.arrayOf(PropTypes.object),
  getAddressOnMarkerClick: PropTypes.bool.isRequired,
  entry: EntryPropTypes,
}

BasicMap.defaultProps = {
  renderUserLocation: true,
  height: 500,
  width: '100%',
  options: DEFAULT_MAP_OPTIONS,
  locations: [],
  getAddressOnMarkerClick: false,
  entry: {},
}

export default connect(mapStateToProps, mapDispatchToProps)(BasicMap)
