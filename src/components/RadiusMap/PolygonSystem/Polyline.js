import React, { memo } from 'react'
import PropTypes from 'prop-types'
import toPoints from '../functions/toPoints'

const Polyline = ({ coords, options, ptCorner, zoom, heading, tilt }) => {
  // console.log('Polyline: ', coords)
  const points = coords
    .map(coord => {
      const ptScreen = toPoints(coord.lat, coord.lng, zoom, heading, tilt)
      // console.log('ptCorner: ', ptCorner)
      // console.log('ptScreen: ', ptScreen)
      const x = ptScreen.x - ptCorner.x
      const y = ptScreen.y - ptCorner.y
      // console.log({ x, y })
      return `${x},${y}`
    })
    .join(' ')

  return <polyline points={points} {...options} />
}

Polyline.propTypes = {
  coords: PropTypes.array,
  ptCorner: PropTypes.object,
  zoom: PropTypes.number,
  options: PropTypes.object
}

export default memo(Polyline)
