import React, { memo } from "react"
import QuillSelect from "../QuillSelect"

export const HEADER_OPTIONS = Array.from(Array(5), (x, i) => i + 1)

const Headers = () => (
  <QuillSelect title="Header" className="header" options={HEADER_OPTIONS} />
)

export default memo(Headers)
