import React, { memo } from "react"
import QuillSelect from "../../QuillSelect"
import "./styles.css"

const Sizes = () => (
  <QuillSelect
    options={[
      "8px",
      "9px",
      "10px",
      "11px",
      "12px",
      "14px",
      "16px",
      "18px",
      "20px",
      "22px",
      "24px",
      "26px",
      "28px",
      "36px",
      "48px",
      "72px"
    ]}
    // defaultValue="12px"
    className="size"
  />
)

export default memo(Sizes)
