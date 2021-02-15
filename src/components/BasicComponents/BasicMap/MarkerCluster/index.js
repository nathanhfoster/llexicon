import React, { useMemo, Fragment } from 'react'
import PropTypes from 'prop-types'
import Marker from '../Marker'
import MarkerCounter from './MarkerCounter'
import { connect } from 'react-redux'

const mapStateToProps = ({ Map: { hoveredChildKey } }, { points }) => ({
  scrollToItem: points.find(({ id }) => id == hoveredChildKey),
})

const MarkerCluster = ({ $dimensionKey, lat, lng, zoom, points, scrollToItem, ...resOfProps }) => {
  const shouldRenderMarkerCounter = points.length > 2
  const markerCounterValue = points.length - 2

  const markers = useMemo(() => {
    let m = points.slice(0, 2)
    if (scrollToItem && m.some(({ id }) => id != scrollToItem.id)) {
      m.push(scrollToItem)
    }
    return m
  }, [points, scrollToItem])

  const renderMarkers = useMemo(
    () =>
      markers.map(marker => {
        const { id, ...props } = marker
        return <Marker {...resOfProps} {...props} $dimensionKey={id} inGroup />
      }),
    [markers, resOfProps],
  )

  return (
    <Fragment>
      {renderMarkers}
      {shouldRenderMarkerCounter && <MarkerCounter>+{markerCounterValue}</MarkerCounter>}
    </Fragment>
  )
}

MarkerCluster.propTypes = {
  $dimensionKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  $geoService: PropTypes.object,
  $getDimensions: PropTypes.func,
  $onMouseAllow: PropTypes.func,
  $hover: PropTypes.bool,
  $prerender: PropTypes.bool,
  lat: PropTypes.number,
  lng: PropTypes.number,
  points: PropTypes.array,
  selected: PropTypes.bool,
}

MarkerCluster.defaultProps = { getAddressOnMarkerClick: false }

export default connect(mapStateToProps)(MarkerCluster)
