import React, { Fragment, memo } from "react"
import Align from "./Align"
import Fonts from "./Fonts"
import Headers from "./Headers"
import Sizes from "./Sizes"
import Colors from "./Colors"
import Backgrounds from "./Backgrounds"
import QuillGroup from "../QuillGroup"

const QuillSelectButtons = () => (
  <Fragment>
    <QuillGroup>
      <Align />
      <Fonts />
      <Headers />
      <Sizes />
    </QuillGroup>
    <QuillGroup>
      <Colors />
      <Backgrounds />
    </QuillGroup>
  </Fragment>
)

export default memo(QuillSelectButtons)
