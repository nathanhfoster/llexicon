import React, { memo } from "react"
import QuillGroup from "../QuillGroup"
import "./styles.css"

const BUTTONS = [
  [
    { name: "bold" },
    { name: "italic" },
    { name: "underline" },
    { name: "strike" },
    { name: "blockquote" },
    { name: "code-block" },
  ],
  [
    { name: "script", value: "sub" },
    { name: "script", value: "super" },
  ],
  [
    { name: "list", value: "ordered" },
    { name: "list", value: "bullet" },
    { name: "indent", value: "-1" },
    { name: "indent", value: "+1" },
    { name: "direction", value: "rtl" },
  ],
  [{ name: "link" }, { name: "image" }, { name: "video" }],
  [{ name: "clean" }],
]

const renderButtonGroup = (key, buttons) => (
  <QuillGroup key={key}>{renderButtons(buttons)}</QuillGroup>
)

const renderButtons = (buttons) =>
  buttons.map((button, i) => {
    if (Array.isArray(button)) {
      return renderButtonGroup(i, button)
    } else {
      const { name, value } = button
      return <button key={i} className={`ql-${name}`} value={value} />
    }
  })

const QuillButtons = () => renderButtons(BUTTONS)

export default memo(QuillButtons)
