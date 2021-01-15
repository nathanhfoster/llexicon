import React from "react"

const QuillGroup = ({ style, children }) => (
  <span className="ql-formats" style={style}>
    {children}
  </span>
)

export default QuillGroup