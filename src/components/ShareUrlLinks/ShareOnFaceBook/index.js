import React, { memo } from "react"
import PropTypes from "prop-types"
import ShareUrl from "../"

const ShareOnFacebook = ({ url }) => (
  <ShareUrl href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}>
    <i className="fab fa-facebook-square" />
  </ShareUrl>
)

ShareOnFacebook.propTypes = {
  url: PropTypes.string.isRequired,
}

ShareOnFacebook.defaultProps = { url: window.location.href }

export default memo(ShareOnFacebook)
