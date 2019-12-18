import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import deepEquals from '../../../helpers/deepEquals'

import Marker from '../Marker'
import MarkerCounter from './MarkerCounter'

class MarkerCluster extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {
    $dimensionKey: PropTypes.string,
    $geoService: PropTypes.object,
    $getDimensions: PropTypes.func,
    $onMouseAllow: PropTypes.func,
    $hover: PropTypes.bool,
    $prerender: PropTypes.bool,
    lat: PropTypes.number,
    lng: PropTypes.number,
    points: PropTypes.array,
    selected: PropTypes.bool
  }

  static defaultProps = {}

  static getDerivedStateFromProps(nextProps, prevState) {
    const { points, $dimensionKey, $hover, hoveredChildKey, zoom } = nextProps
    const shouldRenderMarkerCounter = points.length > 2
    const markerCounterValue = points.length - 2

    return {
      markers: points.slice(0, 2),
      markerCounterValue,
      shouldRenderMarkerCounter,
      $dimensionKey,
      $hover,
      hoveredChildKey,
      zoom
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const propsChanged = !deepEquals(this.props, nextProps)

    return propsChanged
  }

  renderMarkers = (markers, hoveredChildKey) => {
    const { selectSite, setMapCenterBoundsZoom, $onMouseAllow } = this.props
    const { zoom } = this.state
    return markers.map(marker => {
      const { id, ...props } = marker
      return (
        <Marker
          {...props}
          $dimensionKey={id}
          $hover={hoveredChildKey === id}
          $onMouseAllow={$onMouseAllow}
          selectSite={selectSite}
          setMapCenterBoundsZoom={setMapCenterBoundsZoom}
          zoom={zoom}
          inGroup
        />
      )
    })
  }

  render() {
    const {
      markers,
      markerCounterValue,
      shouldRenderMarkerCounter,
      $dimensionKey,
      $hover,
      hoveredChildKey
    } = this.state

    return (
      <Fragment>
        {this.renderMarkers(markers, hoveredChildKey)}
        {shouldRenderMarkerCounter && <MarkerCounter>+{markerCounterValue}</MarkerCounter>}
      </Fragment>
    )
  }
}
export default MarkerCluster
