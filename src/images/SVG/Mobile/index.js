import React, { memo } from "react"
import "../styles.css"

const Mobile = ({ className }) => (
  <svg
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 320 512"
    className={className}
  >
    <path
      fill="currentColor"
      d="M0 384v80a48 48 0 0 0 48 48h224a48 48 0 0 0 48-48v-80zm160 96a32 32 0 1 1 32-32 32 32 0 0 1-32 32z"
      className="fa-secondary"
    ></path>
    <path
      fill="#ecf0f1"
      d="M0 384V48A48 48 0 0 1 48 0h224a48 48 0 0 1 48 48v336z"
      className="fa-primary"
    ></path>
  </svg>
)

Mobile.defaultProps = {
  className: "DefaultSvgClass"
}

export default memo(Mobile)
