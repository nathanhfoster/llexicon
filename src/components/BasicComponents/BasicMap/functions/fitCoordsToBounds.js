const fitCoordsToBounds = (map, maps, coords) => {
  if (coords.length === 0) return

  const bounds = new maps.LatLngBounds()

  const extendBounds = (lat, lng) => {
    const latLng = new maps.LatLng(lat, lng)
    bounds.extend(latLng)
  }

  const extendCoordsBounds = coords =>
    coords.forEach(coord => {
      if (coord.hasOwnProperty("lat") && coord.hasOwnProperty("lng")) {
        extendBounds(coord.lat, coord.lng)
      } else if (Array.isArray(coord)) {
        extendCoordsBounds(coord)
      }
    })

  extendCoordsBounds(coords)

  map.fitBounds(bounds)

  const formatedBounds = {
    ne: { lat: bounds.getNorthEast().lat(), lng: bounds.getNorthEast().lng() },
    sw: { lat: bounds.getSouthWest().lat(), lng: bounds.getSouthWest().lng() }
  }

  const center = [bounds.getCenter().lat(), bounds.getCenter().lng()]

  const zoom = map.getZoom()

  if (zoom > 17) {
    map.setZoom(16)
  }

  return { bounds: formatedBounds, center, zoom }
}

export default fitCoordsToBounds
