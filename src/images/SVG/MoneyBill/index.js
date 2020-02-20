import React, { memo } from "react"
import "../styles.css"

const MoneyBill = ({ className }) => (
  <svg
    aria-hidden="true"
    focusable="false"
    data-prefix="fad"
    data-icon="money-bill"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 512"
    className={className}
  >
    <g class="fa-group">
      <path
        fill="#ecf0f1"
        d="M101.22 112A112.5 112.5 0 0 1 48 165.22v181.56A112.5 112.5 0 0 1 101.22 400h437.56A112.5 112.5 0 0 1 592 346.78V165.22A112.5 112.5 0 0 1 538.78 112zM320 352c-44.19 0-80-43-80-96s35.82-96 80-96 80 43 80 96-35.83 96-80 96z"
        class="fa-secondary"
      ></path>
      <path
        fill="var(--accentColor)"
        d="M616 64H24A24 24 0 0 0 0 88v336a24 24 0 0 0 24 24h592a24 24 0 0 0 24-24V88a24 24 0 0 0-24-24zm-24 282.78A112.5 112.5 0 0 0 538.78 400H101.22A112.5 112.5 0 0 0 48 346.78V165.22A112.5 112.5 0 0 0 101.22 112h437.56A112.5 112.5 0 0 0 592 165.22z"
        class="fa-primary"
      ></path>
    </g>
  </svg>
)

MoneyBill.defaultProps = {
  className: "DefaultSvgClassName"
}

export default memo(MoneyBill)
