import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import deepEquals from "../../../helpers/deepEquals"

import Marker from "../Marker"
import MarkerCounter from "./MarkerCounter"

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

  static defaultProps = { getAddressOnMarkerClick: false }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { points } = nextProps
    const shouldRenderMarkerCounter = points.length > 2
    const markerCounterValue = points.length - 2

    return {
      markers: points.slice(0, 2),
      markerCounterValue,
      shouldRenderMarkerCounter
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const propsChanged = !deepEquals(this.props, nextProps)

    return propsChanged
  }

  renderMarkers = markers => {
    const {
      $dimensionKey,
      lat,
      lng,
      zoom,
      points,
      ...resOfProps
      // getAddressOnMarkerClick,
      // onChangeCallback,
      // $hover,
      // $getDimensions,
      // $geoService,
      // $onMouseAllow,
      // $prerender
    } = this.props

    return markers.map(marker => {
      const { id, ...props } = marker

      return <Marker {...resOfProps} {...props} $dimensionKey={id} inGroup />
    })
  }

  render() {
    const {
      markers,
      markerCounterValue,
      shouldRenderMarkerCounter
    } = this.state

    return (
      <Fragment>
        {this.renderMarkers(markers)}
        {shouldRenderMarkerCounter && (
          <MarkerCounter>+{markerCounterValue}</MarkerCounter>
        )}
      </Fragment>
    )
  }
}
export default MarkerCluster
