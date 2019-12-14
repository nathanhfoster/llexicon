// Source: https://github.com/Leaflet/Leaflet.draw/blob/leaflet-master/dist/leaflet.draw-src.js#L1733
import PropTypes from 'prop-types'

class Geometry {
  constructor(props) {
    const { points } = props
    this.points = points
  }

  // Polylines with 2 sides can only intersect in cases where points are collinear (we don't support detecting these).
  // Cannot have intersection when < 3 line segments (< 4 points)
  tooFewPointsForIntersection = extraPoints => {
    var points = this.points,
      len = points ? points.length : 0
    // Increment length by extraPoints if present
    len += extraPoints || 0

    return !this.points || len <= 3
  }

  // Given three colinear points p, q, r, the function checks if
  // point q lies on line segment 'pr'
  onSegment = (p, q, r) => {
    if (
      q.lat <= Math.max(p.lat, r.lat) &&
      q.lat >= Math.min(p.lat, r.lat) &&
      q.lng <= Math.max(p.lng, r.lng) &&
      q.lng >= Math.min(p.lng, r.lng)
    )
      return true

    return false
  }

  segmentsIntersect = (p, p1, p2, p3) =>
    this.checkCounterclockwise(p, p2, p3) !== this.checkCounterclockwise(p1, p2, p3) &&
    this.checkCounterclockwise(p, p1, p2) !== this.checkCounterclockwise(p, p1, p3)

  checkCounterclockwise = (p, p1, p2) =>
    (p2.lng - p.lng) * (p1.lat - p.lat) > (p1.lng - p.lng) * (p2.lat - p.lat)

  lineSegmentsIntersectsRange = (p, p1, maxIndex, minIndex) => {
    var points = this.points,
      p2,
      p3

    minIndex = minIndex || 0

    // Check all previous line segments (beside the immediately previous) for intersections
    for (var j = maxIndex; j > minIndex; j--) {
      p2 = points[j - 1]
      p3 = points[j]

      if (this.segmentsIntersect(p, p1, p2, p3)) {
        return true
      }
      // TODO: Find when a line is on top of another
      // if (this.onSegment(p, p1, p2)) {
      //   return true
      // }
    }

    return false
  }

  // Check to see if this polyline has any linesegments that intersect.
  // NOTE: does not support detecting intersection for degenerate cases.
  intersects = () => {
    var points = this.points,
      len = points ? points.length : 0,
      i,
      p,
      p1

    if (this.tooFewPointsForIntersection()) {
      return false
    }

    for (i = len - 1; i >= 3; i--) {
      p = points[i - 1]
      p1 = points[i]

      if (this.lineSegmentsIntersectsRange(p, p1, i - 2)) {
        return true
      }
    }

    return false
  }

  getPolygonCenter = () => {
    const { points } = this
    var x = points.map(point => point.lat)
    var y = points.map(point => point.lng)
    var cx = (Math.min(...x) + Math.max(...x)) / 2
    var cy = (Math.min(...y) + Math.max(...y)) / 2
    return [cx, cy]
  }
}

Geometry.propTypes = {
  points: PropTypes.arrayOf(
    PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired
    })
  ).isRequired
}

export default Geometry
