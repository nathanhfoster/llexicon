import React, { memo } from "react"
import QuillSelect from "../QuillSelect"

const OPTIONS = ["center", "right", "justify"]

const Align = () => (
  <QuillSelect
    title="Align"
    defaultValue="selected"
    options={OPTIONS}
    className={"align"}
  />
)

export default memo(Align)
