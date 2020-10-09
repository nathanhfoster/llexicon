import React, { memo } from "react"
import QuillSelect from "../QuillSelect"
import "./styles.css"

const OPTIONS = [
  "roboto",
  "arial",
  "serif",
  "monospace",
  "comic-sans",
  "courier-new",
  "georgia",
  "helvetica",
  "lucida",
]

const Fonts = ({}) => (
  <QuillSelect
    className="font"
    options={OPTIONS}
    // defaultValue="roboto"
  />
)

export default memo(Fonts)
