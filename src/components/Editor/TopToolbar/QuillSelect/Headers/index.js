import React, { memo } from "react"
import QuillSelect from "../../QuillSelect"

const Headers = () => (
  <QuillSelect
    options={Array.from(Array(5), (x, i) => i + 1)}
    className="header"
  />
)

export default memo(Headers)
