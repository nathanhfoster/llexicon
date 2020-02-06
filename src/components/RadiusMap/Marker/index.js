import React, { memo } from "react"
import PropTypes from "prop-types"
import PreviewBox from "./PreviewBox"
import Stick from "./Stick"
import { markerStyle } from "./styles"

const getShouldShowPreview = ({ $hover, hoveredChildKey, $dimensionKey }) =>
  $hover || hoveredChildKey === $dimensionKey

const Marker = props => {
  const { $onMouseAllow, zIndex } = props
  const shouldShowPreview = getShouldShowPreview(props)

  const style = {
    ...markerStyle,
    zIndex: shouldShowPreview ? 1000 : zIndex
  }

  const onMouseEnter = () => $onMouseAllow(true)

  const onMouseLeave = () => $onMouseAllow(false)

  return (
    <div style={style} onMouseEnter={onMouseEnter}>
      {shouldShowPreview && (
        <PreviewBox {...props} onMouseLeave={onMouseLeave} />
      )}
      <Stick {...props} shouldShowPreview={shouldShowPreview} />
    </div>
  )
}

Marker.propTypes = {
  $dimensionKey: PropTypes.string,
  $geoService: PropTypes.object,
  $getDimensions: PropTypes.func,
  $onMouseAllow: PropTypes.func,
  $hover: PropTypes.bool,
  $prerender: PropTypes.bool,
  hoveredChildKey: PropTypes.string,
  boundaries: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({ lat: PropTypes.number, lng: PropTypes.number })
        .isRequired
    )
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
  boundary: PropTypes.arrayOf(
    PropTypes.shape({ lat: PropTypes.number, lng: PropTypes.number }).isRequired
  ),
  locations: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  marketValue: PropTypes.number,
  parcelNumbers: PropTypes.array,
  siteType: PropTypes.string,
  inGroup: PropTypes.bool,
}

Marker.defaultProps = { inGroup: false, zIndex: 1 }

const areEqual = (prevProps, nextProps) =>
  getShouldShowPreview(prevProps) === getShouldShowPreview(nextProps)

export default memo(Marker, areEqual)
