import axios from "axios"

const { REACT_APP_GOOGLE_LOCATION_API } = process.env

const GetAddress = (lat, lng) =>
  axios
    .get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${lat}, ${lng}&key=${REACT_APP_GOOGLE_LOCATION_API}`
    )
    .then(res => {
      const {
        0: {
          address_components,
          formatted_address,
          geometry: { location, location_type, viewport },
          place_id,
          plus_code,
          types
        }
      } = res.data.results
      return formatted_address
    })
    .catch(e => console.log("GetAddress ERROR: ", e))

export { GetAddress }
