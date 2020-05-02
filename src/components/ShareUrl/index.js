import React, { memo } from "react"
import PropTypes from "prop-types"

const ShareUrl = ({ children, ...restOfProps }) => (
  <a {...restOfProps}>{children}</a>
)

ShareUrl.propTypes = {
  href: PropTypes.string.isRequired,
  target: PropTypes.oneOf(["_self", "_blank", "_parent", "_top"]),
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
}

ShareUrl.defaultProps = { target: "_blank" }

export default memo(ShareUrl)
