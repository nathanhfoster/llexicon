import getPolygonCenter from './getPolygonCenter'

const formatLocations = locations => {
  let markers = []
  markers = locations.reduce((result, item) => {
    const { location, boundaries, boundary, center, ...props } = item
    const isProjectListItem = boundaries && boundaries.coordinates
    const isActiveProjectItem = boundary && boundary.length > 0
    if (isProjectListItem) {
      const { coordinates } = boundaries
      const [lat, lng] = location
      return result.concat({
        ...props,
        lat,
        lng,
        boundaries: coordinates.map(b =>
          b.map(c => {
            const [lat, lng] = c
            return { lat, lng }
          })
        )
      })
    } else if (isActiveProjectItem) {
      const [lat, lng] = getPolygonCenter(boundary)
      return result.concat({
        ...props,
        lat,
        lng,
        boundary: boundary.map(b => {
          const [lat, lng] = b
          return { lat, lng }
        })
      })
    }
    return result
  }, [])
  return markers
}

export default formatLocations
