import React, { memo } from "react"
import QuillSelect from "../../QuillSelect"

const Sizes = () => (
  <QuillSelect
    options={["small", "normal", "large", "huge"]}
    className="size"
  />
)

export default memo(Sizes)
