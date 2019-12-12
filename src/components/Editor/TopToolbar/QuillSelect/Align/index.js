import React, { memo }  from "react"
import QuillSelect from "../../QuillSelect"

const Align = () => (
  <QuillSelect
    defaultValue="selected"
    options={["center", "right", "justify"]}
    className={"align"}
  />
)

export default memo(Align)
