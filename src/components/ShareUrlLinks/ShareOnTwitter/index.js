import React, { memo } from "react"
import PropTypes from "prop-types"
import ShareUrl from "../"

const ShareOnTwitter = ({ text }) => (
  <ShareUrl href={`https://twitter.com/intent/tweet?text=${text}`}>
    <i className="fab fa-twitter-square" />
  </ShareUrl>
)

ShareOnTwitter.propTypes = {
  text: PropTypes.string.isRequired,
}

ShareOnTwitter.defaultProps = {
  text: `Check my journal entry: ${window.location.href}`,
}

export default memo(ShareOnTwitter)
