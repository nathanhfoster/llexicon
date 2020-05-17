const boundsChanged = (map, callback) =>
  map.addListener('bounds_changed', () => {
    const bounds = map.getBounds()
    const { lat, lng } = map.getCenter()
    const zoom = map.getZoom()

    const center = [lat(), lng()]

    const newBounds = {
      ...this.state.bounds,
      ne: { lat: bounds.getNorthEast().lat(), lng: bounds.getNorthEast().lng() },
      sw: { lat: bounds.getSouthWest().lat(), lng: bounds.getSouthWest().lng() }
    }

    callback({ bounds: newBounds, center, zoom })
  })

export default boundsChanged
