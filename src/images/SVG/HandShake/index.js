import React, { memo } from "react"
import "../styles.css"

const HandShake = ({ className }) => (
  <svg
    aria-hidden="true"
    focusable="false"
    data-prefix="fad"
    data-icon="handshake-alt"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 512"
    className={className}
  >
    <g class="fa-group">
      <path
        fill="currentColor"
        d="M640 143.9v191.8a16 16 0 0 1-16 16h-97.6a63.36 63.36 0 0 0-22.2-37.9L358.6 195.6l26.1-23.9a16 16 0 0 0-21.6-23.6l-27 24.7-53 48.5c-.1.1-.3.1-.4.2-21.1 18.9-46.5 7.8-56.1-2.7a39.69 39.69 0 0 1 2.1-56c.1-.1.2-.3.3-.4l98.3-90a32 32 0 0 1 21.6-8.4h85.9a31.94 31.94 0 0 1 22.6 9.4L512 128h112a16 16 0 0 1 16 15.9z"
        class="fa-secondary"
      ></path>
      <path
        fill="currentColor"
        d="M0 335.9V144a16 16 0 0 1 16-16h112l54.7-54.6a31.94 31.94 0 0 1 22.6-9.4h83.8l-81.8 74.9a72 72 0 0 0-4.4 101.7c14.9 16.3 61.1 41.5 101.7 4.4l30-27.5 149.3 121.2a32.06 32.06 0 0 1 4.6 45.1l-9.5 11.7a32 32 0 0 1-45 4.7l-5.4-4.4-31.4 38.6a37.16 37.16 0 0 1-52.3 5.4L327 424.3l-.2.2a64 64 0 0 1-90 9.3l-90.5-81.9H16a16 16 0 0 1-16-16z"
        class="fa-primary"
      ></path>
    </g>
  </svg>
)

HandShake.defaultProps = {
  className: "DefaultSvgClassName"
}

export default memo(HandShake)
