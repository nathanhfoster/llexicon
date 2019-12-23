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
    onChangeCallback: PropTypes.func.isRequired,
    getAddressOnMarkerClick: PropTypes.bool.isRequired
  }

  static defaultProps = {
    inGroup: false,
    zIndex: 1,
    getAddressOnMarkerClick: false
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      $dimensionKey,
      title,
      $hover,
      zIndex,
      getAddressOnMarkerClick
    } = nextProps

    const shouldShowPreview = $hover

    return {
      $hover,
      zIndex,
      shouldShowPreview
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { $hover } = nextProps
    const currentHover = this.props.$hover

    const mouseHovered = $hover

    const mouseLeft = currentHover != $hover

    return mouseHovered || mouseLeft
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
        <Stick {...this.props} shouldShowPreview={shouldShowPreview} />
      </div>
    )
  }
}
export default Marker
