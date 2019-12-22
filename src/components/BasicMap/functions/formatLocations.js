const formatLocations = locations =>
  locations.reduce((result, item) => {
    const { latitude, longitude, ...props } = item

    if (latitude && longitude) {
      return result.concat({
        ...props,
        lat: parseFloat(latitude.toString()),
        lng: parseFloat(longitude.toString())
      })
    } else {
      return result
    }
  }, [])

export default formatLocations
