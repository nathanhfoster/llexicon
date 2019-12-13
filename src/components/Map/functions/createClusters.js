import SuperCluster from 'points-cluster'

const getMarkerClusters = ({
  markers,
  center,
  zoom,
  bounds,
  showMarkersMinZoom,
  showMarkersMaxZoom,
  markerClusterRadius
}) => {
  const markerClusters = SuperCluster(markers, {
    minZoom: showMarkersMinZoom,
    maxZoom: showMarkersMaxZoom,
    radius: markerClusterRadius
  })

  return markerClusters({ center, zoom, bounds })
}

const createClusters = (markers, { ...props }) => {
  let markerClusters = []
  if (markers.length === 0) return markerClusters
  else
    markerClusters = getMarkerClusters({ markers, ...props }).map(
      ({ wx, wy, numPoints, points }) => ({
        lat: wy,
        lng: wx,
        numPoints,
        id: points[0].id,
        points
      })
    )
  return markerClusters
}

export default createClusters
