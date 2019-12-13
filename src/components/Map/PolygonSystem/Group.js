import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Polyline from './Polyline'

const Group = ({ coords, options, ptCorner, zoom }) => {
  // console.log('Group: ', coords, options, ptCorner, zoom)
  const polylines = coords.map((c, i) => (
    <Polyline key={i} coords={c} ptCorner={ptCorner} options={options} zoom={zoom} />
  ))
  return <g {...options}>{polylines}</g>
}

Group.propTypes = {
  coords: PropTypes.array,
  ptCorner: PropTypes.object,
  zoom: PropTypes.number,
  options: PropTypes.object
}

export default memo(Group)
