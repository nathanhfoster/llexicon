import React, { memo } from "react"
import QuillSelect from "../QuillSelect"
import "./styles.css"

export const SIZE_OPTIONS = [
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
  "72px",
]

const Sizes = () => (
  <QuillSelect
    className="size"
    options={SIZE_OPTIONS}
    // defaultValue="12px"
  />
)

export default memo(Sizes)
