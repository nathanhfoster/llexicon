import React, { useEffect, useRef, memo } from "react"
import PropTypes from "prop-types"
import deepEquals from "../../../../../helpers/deepEquals"
import fitCoordsToBounds from "../../../functions/fitCoordsToBounds"
import "./styles.css"

const MapSearchBox = ({
  map,
  mapApi,
  setMapCenterBoundsZoom,
  onChangeCallback,
  getAddressOnMarkerClick,
  UserLocation,
  locations,
  panTo,
  zoom
}) => {
  let searchBox = useRef()
  let searchInput = useRef()

  useEffect(() => {
    searchBox = new mapApi.places.SearchBox(searchInput)
    searchBox.addListener("places_changed", handlePlacesChange)
    searchBox.bindTo("bounds", map)
    return () => {
      console.log("UNFdnfjs")
      mapApi.event.clearInstanceListeners(searchInput)
    }
  }, [])

  const handlePlacesChange = () => {
    const selected = searchBox.getPlaces()
    const { 0: place } = selected
    if (!place || !place.geometry) return
    const {
      address_components,
      adr_address,
      formatted_address,
      geometry,
      html_attributions,
      icon,
      id,
      name,
      place_id,
      plus_code,
      reference,
      scope,
      types,
      url,
      utc_offset_minutes,
      vicinity
    } = place

    const { location, viewport } = geometry
    const { lat, lng } = location

    const bounds = new mapApi.LatLngBounds()

    if (types.includes("country")) {
      zoom = 4
    } else if (
      types.includes("administrative_area_level_1") ||
      types.includes("administrative_area_level_2") ||
      types.includes("administrative_area_level_3") ||
      types.includes("locality") ||
      types.includes("sublocality") ||
      types.includes("political") ||
      types.includes("postal_code")
    ) {
      zoom = 13
    } else {
      zoom = 17
    }

    if (viewport) {
      bounds.union(viewport)
    } else {
      bounds.extend(location)
    }

    map.fitBounds(bounds)

    const newPosition = { lat: lat(), lng: lng() }

    const userLocation = {
      lat: UserLocation.latitude,
      lng: UserLocation.longitude
    }

    // console.log(formatted_address)

    onChangeCallback({
      entryId: "NewEntry",
      latitude: newPosition.lat,
      longitude: newPosition.lng,
      address: formatted_address
    })

    const center = Object.values(newPosition)

    panTo({ center })

    //setMapCenterBoundsZoom({ center, zoom })

    // let coords = locations.reduce((result, location) => {
    //   const { latitude, longitude } = location
    //   if (latitude && longitude) {
    //     location = {
    //       lat: parseFloat(latitude.toString()),
    //       lng: parseFloat(longitude.toString())
    //     }
    //     return result.concat(location)
    //   } else {
    //     return result
    //   }
    // }, [])

    // if (newPosition.lat && newPosition.lng) {
    //   coords.push(newPosition)
    // }

    // if (userLocation.lat && userLocation.lng) {
    //   coords.push(userLocation)
    // }

    // fitCoordsToBounds(map, mapApi, coords)
    searchInput.blur()
  }

  const clearSearchBox = () => {
    searchInput.value = ""
  }

  const selectSearchBox = ({ target }) => target.select()

  return (
    <div className="mapBoxSearchBoxContainer">
      <input
        ref={ref => (searchInput = ref)}
        className="mapBoxSearchBoxInput"
        type="text"
        onFocus={selectSearchBox}
        placeholder="Enter a location"
        // onChange={handleInputChange}
      />
    </div>
  )
}

export default memo(MapSearchBox)
