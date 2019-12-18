import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import deepEquals from '../../../../../helpers/deepEquals'
import './styles.css'

class MapSearchBox extends PureComponent {
  constructor(props) {
    super(props)

    this.state = { shouldFetchParlaySite: false }
  }

  static propTypes = {}

  static defaultProps = {}

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      siteDescription,
      item: { id, client },
      search: { clientId },
      activeClient
    } = nextProps
    let shouldFetchParlaySite = false

    if (activeClient.id || client.id || clientId !== 'None') shouldFetchParlaySite = true

    return { shouldFetchParlaySite, siteDescription }
  }

  componentDidMount() {
    const { map, mapApi } = this.props
    this.searchBox = new mapApi.places.SearchBox(this.searchInput)
    this.searchBox.addListener('places_changed', this.handlePlacesChange)
    this.searchBox.bindTo('bounds', map)
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
      fetchParlaySite,
      resetProject,
      resetProjects,
      setMapSites
    } = this.props

    const { shouldFetchParlaySite } = this.state

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

    // resetProject()
    // resetProjects()

    if (shouldFetchParlaySite) fetchParlaySite(lat(), lng(), formatted_address)
    else setMapSites([])
    // this.setProjectsSearchProps('None')

    let { zoom } = this.props
    const bounds = new google.maps.LatLngBounds()

    if (types.includes('country')) {
      zoom = 4
    } else if (
      types.includes('administrative_area_level_1') ||
      types.includes('administrative_area_level_2') ||
      types.includes('administrative_area_level_3') ||
      types.includes('locality') ||
      types.includes('sublocality') ||
      types.includes('political') ||
      types.includes('postal_code')
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

    // const center = [lat(), lng()]
    //setMapCenterBoundsZoom({ center, zoom })
    map.fitBounds(bounds)
    this.searchInput.blur()
  }

  setProjectsSearchProps = id => {
    const { setProjectsSearchProps } = this.props
    const searchProjectsPayload = {
      clientId: id !== 'All' ? id : null,
      pageNumber: 1
    }
    setProjectsSearchProps(searchProjectsPayload)
  }

  clearSearchBox = () => {
    this.searchInput.value = ''
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
