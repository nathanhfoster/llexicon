import React from 'react'
import PropTypes from 'prop-types'
import ShareUrlLinks from '../ShareUrlLinks'

const ShareOnLinkedIn = props => (
  <ShareUrlLinks
    {...props}
    href='https://www.linkedin.com/shareArticle'
    mini='true'
    parameterString='mini, url, title, sumary, source'
  >
    <i className='fab fa-linkedin-in' />
  </ShareUrlLinks>
)

ShareOnLinkedIn.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string,
  summary: PropTypes.string,
  source: PropTypes.string,
}

ShareOnLinkedIn.defaultProps = { title: 'LinkedIn', url: window.location.origin }

export default ShareOnLinkedIn
