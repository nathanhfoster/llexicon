import React, { Component } from "react"
import PropTypes from "prop-types"

import { markerStyle } from "./styles"

import PreviewBox from "./PreviewBox"
import Stick from "./Stick"

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
    boundaries: PropTypes.arrayOf(
      PropTypes.arrayOf(PropTypes.objectOf(PropTypes.number))
    ),
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
    setMapCenterBoundsZoom: PropTypes.func.isRequired,
    renderUserLocation: PropTypes.bool,
    onChangeCallback: PropTypes.func.isRequired
  }

  static defaultProps = { inGroup: false, zIndex: 1 }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { $dimensionKey, $hover, hoveredChildKey, zIndex } = nextProps

    const shouldShowPreview = $hover || hoveredChildKey === $dimensionKey

    return {
      $hover,
      zIndex,
      shouldShowPreview
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { hoveredChildKey, $hover, zoom } = nextProps
    const currentHoveredChildKey = this.props.hoveredChildKey
    const currentDimensionKey = this.props.$dimensionKey
    const currentHover = this.props.$hover
    const currentZoom = this.state.zoom

    const mouseHovered = currentDimensionKey == hoveredChildKey || $hover

    const mouseLeft =
      currentHoveredChildKey != hoveredChildKey || currentHover != $hover

    const zoomChanged = currentZoom !== zoom

    return mouseHovered || mouseLeft || zoomChanged
  }

  render() {
    const { $hover, zIndex, shouldShowPreview } = this.state

    const style = {
      ...markerStyle,
      zIndex: $hover ? 1000 : zIndex
    }

    return (
      <div style={style}>
        {shouldShowPreview && <PreviewBox {...this.props} />}
        <Stick {...this.props} />
      </div>
    )
  }
}
export default Marker
