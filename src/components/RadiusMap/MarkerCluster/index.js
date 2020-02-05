import React, { Fragment, useMemo, memo } from "react"
import PropTypes from "prop-types"
import Marker from "../Marker"
import MarkerCounter from "./MarkerCounter"

const MarkerCluster = ({
  $dimensionKey,
  lat,
  lng,
  zoom,
  points,
  ...resOfProps
}) => {
  const shouldRenderMarkerCounter = points.length > 2
  const markerCounterValue = points.length - 2
  const markers = points.slice(0, 2)

  const renderMarkers = useMemo(
    () =>
      markers.map(marker => {
        const { id, ...props } = marker
        return <Marker {...resOfProps} {...props} $dimensionKey={id} inGroup />
      }),
    [markers]
  )

  return (
    <Fragment>
      {renderMarkers}
      {shouldRenderMarkerCounter && (
        <MarkerCounter>+{markerCounterValue}</MarkerCounter>
      )}
    </Fragment>
  )
}

MarkerCluster.propTypes = {
  $dimensionKey: PropTypes.string,
  $geoService: PropTypes.object,
  $getDimensions: PropTypes.func,
  $onMouseAllow: PropTypes.func,
  $hover: PropTypes.bool,
  $prerender: PropTypes.bool,
  lat: PropTypes.number,
  lng: PropTypes.number,
  points: PropTypes.array,
  selected: PropTypes.bool
}

MarkerCluster.defaultProps = { getAddressOnMarkerClick: false }

export default memo(MarkerCluster)
