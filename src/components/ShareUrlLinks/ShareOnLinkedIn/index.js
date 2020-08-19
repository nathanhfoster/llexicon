import React, { memo } from "react"
import PropTypes from "prop-types"
import ShareUrl from "../"

const ShareOnLinkedIn = ({ url, ...restOfProps }) => (
  <ShareUrl href={`https://www.linkedin.com/shareArticle?mini=true&url=${url}`} {...restOfProps}>
    <i className="fab fa-linkedin" />
  </ShareUrl>
)

ShareOnLinkedIn.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  url: PropTypes.string.isRequired,
}

ShareOnLinkedIn.defaultProps = { title: 'LinkedIn', text: 'LinedIn', url: window.location.href }

export default memo(ShareOnLinkedIn)
