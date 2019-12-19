import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import deepEquals from "../../../../../helpers/deepEquals"
import fitCoordsToBounds from "../../../functions/fitCoordsToBounds"
import "./styles.css"

class MapSearchBox extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {}

  static defaultProps = {}

  componentDidMount() {
    const { map, mapApi } = this.props
    this.searchBox = new mapApi.places.SearchBox(this.searchInput)
    this.searchBox.addListener("places_changed", this.handlePlacesChange)
    this.searchBox.bindTo("bounds", map)
  }

  componentWillUnmount() {
    const { mapApi } = this.props
    mapApi.event.clearInstanceListeners(this.searchInput)
  }

  handlePlacesChange = () => {
    const {
      map,
      mapApi,
      setMapCenterBoundsZoom,
      onChangeCallback,
      UserLocation
    } = this.props

    const selected = this.searchBox.getPlaces()
    const { 0: place } = selected
    if (!place.geometry) return
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

    let { zoom } = this.props
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

    onChangeCallback({ latitude: newPosition.lat, longitude: newPosition.lng })

    // const center = [lat(), lng()]
    //setMapCenterBoundsZoom({ center, zoom })

    // fitCoordsToBounds(map, mapApi, [newPosition, userLocation])
    this.searchInput.blur()
  }

  setProjectsSearchProps = id => {
    const { setProjectsSearchProps } = this.props
    const searchProjectsPayload = {
      clientId: id !== "All" ? id : null,
      pageNumber: 1
    }
    setProjectsSearchProps(searchProjectsPayload)
  }

  clearSearchBox = () => {
    this.searchInput.value = ""
  }

  selectSearchBox = e => {
    e.target.select()
  }

  render() {
    return (
      <div className="mapBoxSearchBoxContainer">
        <input
          ref={ref => (this.searchInput = ref)}
          className="mapBoxSearchBoxInput"
          type="text"
          onFocus={this.selectSearchBox}
          placeholder="Enter a location"
          onChange={this.handleInputChange}
        />
      </div>
    )
  }
}

export default MapSearchBox
