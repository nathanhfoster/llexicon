import React, { memo } from 'react'
import PropTypes from 'prop-types'

export const ShareUrlLinks = ({ children, ...restOfProps }) => <a {...restOfProps}>{children}</a>

ShareUrlLinks.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  href: PropTypes.string.isRequired,
  target: PropTypes.oneOf(['_self', '_blank', '_parent', '_top']),
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
}

ShareUrlLinks.defaultProps = { target: '_blank' }

export default memo(ShareUrlLinks)
