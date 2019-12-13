import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { markerStyle } from './styles'

import PreviewBox from './PreviewBox'
import Stick from './Stick'

class Marker extends Component {
  constructor(props) {
    super(props)
    this.state = { zoom: null }
  }

  static propTypes = {
    $dimensionKey: PropTypes.string,
    $geoService: PropTypes.object,
    $getDimensions: PropTypes.func,
    $onMouseAllow: PropTypes.func,
    $hover: PropTypes.bool,
    $prerender: PropTypes.bool,
    hoveredChildKey: PropTypes.string,
    boundaries: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.objectOf(PropTypes.number))),
    clientId: PropTypes.string,
    clientName: PropTypes.string,
    engagingContacts: PropTypes.array,
    lastActivity: PropTypes.string,
    lat: PropTypes.number,
    lng: PropTypes.number,
    location: PropTypes.array,
    siteDescription: PropTypes.string,
    state: PropTypes.string,
    zIndex: PropTypes.number,
    zipcode: PropTypes.string,
    score: PropTypes.string,
    acreage: PropTypes.number,
    boundary: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    locations: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
    marketValue: PropTypes.number,
    parcelNumbers: PropTypes.array,
    siteType: PropTypes.string,
    inGroup: PropTypes.bool,
    selectSite: PropTypes.func.isRequired,
    setMapCenterBoundsZoom: PropTypes.func.isRequired
  }

  static defaultProps = { inGroup: false, zIndex: 1 }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      $dimensionKey,
      $geoService,
      $getDimensions,
      $hover,
      $onMouseAllow,
      $prerender,
      hoveredChildKey,
      boundaries,
      clientId,
      clientName,
      engagingContacts,
      lastActivity,
      lat,
      lng,
      location,
      siteDescription,
      state,
      zIndex,
      zipcode,
      score,
      acreage,
      boundary,
      locations,
      marketValue,
      parcelNumbers,
      siteType,
      zoom,
      inGroup
    } = nextProps

    const shouldShowPreview = $hover || hoveredChildKey === $dimensionKey

    return {
      $dimensionKey,
      $getDimensions,
      $hover,
      $onMouseAllow,
      $prerender,
      boundaries,
      clientId,
      clientName,
      engagingContacts,
      lastActivity,
      lat,
      lng,
      location,
      siteDescription,
      state,
      zIndex,
      zipcode,
      score,
      acreage,
      boundary,
      locations,
      marketValue,
      parcelNumbers,
      siteType,
      inGroup,
      shouldShowPreview,
      zoom
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { hoveredChildKey, $hover, zoom } = nextProps
    const currentHoveredChildKey = this.props.hoveredChildKey
    const currentDimensionKey = this.props.$dimensionKey
    const currentHover = this.props.$hover
    const currentZoom = this.state.zoom

    const mouseHovered = currentDimensionKey == hoveredChildKey || $hover

    const mouseLeft = currentHoveredChildKey != hoveredChildKey || currentHover != $hover

    const zoomChanged = currentZoom !== zoom

    return mouseHovered || mouseLeft || zoomChanged
  }

  render() {
    const { selectSite, setMapCenterBoundsZoom } = this.props
    const {
      $dimensionKey,
      $getDimensions,
      $hover,
      $onMouseAllow,
      $prerender,
      boundaries,

      clientId,
      clientName,
      engagingContacts,
      lastActivity,
      lat,
      lng,
      location,
      siteDescription,
      state,
      zIndex,
      zipcode,
      score,
      acreage,
      boundary,
      locations,
      marketValue,
      parcelNumbers,
      siteType,
      inGroup,
      shouldShowPreview,
      zoom
    } = this.state

    const style = {
      ...markerStyle,
      zIndex: $hover ? 1000 : zIndex
    }

    const ComponentProps = {
      $dimensionKey,
      clientName,
      siteDescription,
      score,
      lastActivity,
      shouldShowPreview,
      inGroup,
      center: [lat, lng],
      selectSite,
      setMapCenterBoundsZoom,
      zoom
    }

    return (
      <div style={style}>
        {shouldShowPreview && <PreviewBox {...ComponentProps} />}
        <Stick {...ComponentProps} />
      </div>
    )
  }
}
export default Marker
