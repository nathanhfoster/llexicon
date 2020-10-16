import React from "react"
import Align from "./Align"
import Fonts from "./Fonts"
import Headers from "./Headers"
import Sizes from "./Sizes"
import Colors from "./Colors"
import Backgrounds from "./Backgrounds"

const QuillSelectButtons = () => (
  <span className="ql-formats">
    <Align />
    <Fonts />
    <Headers />
    <Sizes />
    <Colors />
    <Backgrounds />
  </span>
)

export default QuillSelectButtons
