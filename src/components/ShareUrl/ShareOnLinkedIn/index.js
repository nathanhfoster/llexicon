import React, { memo } from "react"
import PropTypes from "prop-types"
import ShareUrl from "../"

const ShareOnLinkedIn = ({ url }) => (
  <ShareUrl href={`https://www.linkedin.com/shareArticle?mini=true&url=${url}`}>
    <i className="fab fa-linkedin" />
  </ShareUrl>
)

ShareOnLinkedIn.propTypes = {
  url: PropTypes.string.isRequired,
}

ShareOnLinkedIn.defaultProps = { url: window.location.href }

export default memo(ShareOnLinkedIn)
