import React, { memo }  from "react"
import QuillSelect from ".."
import "./styles.css"

const Fonts = ({}) => (
  <QuillSelect
    options={[
      "roboto",
      "arial",
      "serif",
      "monospace",
      "comic-sans",
      "courier-new",
      "georgia",
      "helvetica",
      "lucida"
    ]}
    className={"font"}
    // defaultValue="roboto"
  />
)

export default memo(Fonts)
