import PropTypes from 'prop-types'

const GooglePolygon = ({
  paths,
  strokeColor,
  strokeOpacity,
  strokeWeight,
  fillColor,
  fillOpacity
}) =>
  new google.maps.Polygon({
    paths,
    strokeColor,
    strokeOpacity,
    strokeWeight,
    fillColor,
    fillOpacity
  })

GooglePolygon.propTypes = {
  paths: PropTypes.arrayOf(PropTypes.object),
  strokeColor: PropTypes.string,
  strokeOpacity: PropTypes.number,
  strokeWeight: PropTypes.number,
  fillColor: PropTypes.string,
  fillOpacity: PropTypes.number
}

export default GooglePolygon
