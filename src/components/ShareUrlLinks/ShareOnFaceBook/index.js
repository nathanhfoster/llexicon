import React, { memo } from "react"
import PropTypes from "prop-types"
import ShareUrl from "../"

const ShareOnFacebook = ({ url, restOfProps }) => (
  <ShareUrl href={`https://www.facebook.com/sharer/sharer.php?u=${url}`} url={url} {...restOfProps}>
    <i className="fab fa-facebook-square" />
  </ShareUrl>
)

ShareOnFacebook.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  url: PropTypes.string.isRequired,
}

ShareOnFacebook.defaultProps = { title: 'Facebook', text: 'Facebook', url: window.location.href }

export default memo(ShareOnFacebook)
