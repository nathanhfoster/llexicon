const formatLocations = locations =>
  locations.reduce((result, item) => {
    const { latitude, longitude, ...props } = item

    if (latitude && longitude) {
      return result.concat({
        ...props,
        lat: latitude,
        lng: longitude
      })
    } else {
      return result
    }
  }, [])

export default formatLocations
