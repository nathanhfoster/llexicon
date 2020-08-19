import React, { memo } from "react"
import PropTypes from "prop-types"
import ShareUrl from "../"

const ShareOnTwitter = ({ text, ...restOfProps }) => (
  <ShareUrl href={`https://twitter.com/intent/tweet?text=${text}`} {...restOfProps}>
    <i className="fab fa-twitter-square" />
  </ShareUrl>
)

ShareOnTwitter.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
}

ShareOnTwitter.defaultProps = {
  title: 'Twitter',
  text: `Check my journal entry: ${window.location.href}`,
}

export default memo(ShareOnTwitter)
