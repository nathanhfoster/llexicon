import React, { memo } from 'react'
import PropTypes from 'prop-types'

export const RatingIcon = ({ rating }) =>
  rating < 1
    ? new Array(1).fill().map((item, i) => <i key={i} className='far fa-star' />)
    : new Array(Math.round(rating)).fill().map((item, i) => <i key={i} className='fas fa-star' />)

RatingIcon.propTypes = {
  rating: PropTypes.number.isRequired,
}

RatingIcon.defaultProps = {
  rating: 0,
}

export default memo(RatingIcon)
