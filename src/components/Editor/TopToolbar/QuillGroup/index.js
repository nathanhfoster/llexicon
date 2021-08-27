import React, { memo } from "react"

const QuillGroup = ({ children }) => (
  <span className="ql-formats">{children}</span>
)

export default memo(QuillGroup)
