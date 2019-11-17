import React from "react"
import QuillSelect from ".."

const Align = () => (
  <QuillSelect
    defaultValue="selected"
    options={["center", "right", "justify"]}
    className={"align"}
  />
)

export default Align
