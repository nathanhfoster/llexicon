import React from "react"
import QuillSelect from ".."

const Headers = () => (
  <QuillSelect
    options={Array.from(Array(5), (x, i) => i + 1)}
    className="header"
  />
)

export default Headers
