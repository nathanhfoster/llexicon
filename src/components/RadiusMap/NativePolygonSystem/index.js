import Polygon from './GooglePolygon'

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

class Polygons extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {
    map: PropTypes.object.isRequired,
    maps: PropTypes.object.isRequired,
    coords: PropTypes.array.isRequired
  }

  static defaultProps = {
    options: {
      strokeColor: '#28c679',
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillColor: '#2aff00'
    }
  }

  componentWillMount() {
    this.getState(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const { map, maps, coords, shouldRenderPolygons, options } = props
    const Polygons = this.getPolygons(coords, options)
    Polygons.forEach(p => {
      p.setMap(shouldRenderPolygons ? map : null)
      // p.setEditable(true)
    })
    this.setState({ Polygons, shouldRenderPolygons })
  }

  getPolygons = (coords, options) =>
    coords.map(c =>
      Polygon({
        ...options,
        paths: c
      })
    )

  render() {
    return <noscript />
  }
}
export default Polygons
