const formatLocations = locations =>
  locations.reduce((acc, item) => {
    const { latitude, longitude, ...props } = item

    if (latitude && longitude) {
      const lat = parseFloat(latitude.toString?.())
      const lng = parseFloat(longitude.toString?.())

      if (!isNaN(lat) && !isNaN(lng)) {
        acc.push({
          ...props,
          lat,
          lng,
        })
      }
    }
    return acc
  }, [])

export default formatLocations
