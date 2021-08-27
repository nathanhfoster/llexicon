import React, { memo } from "react"
import QuillGroup from "../QuillGroup"
import "./styles.css"

const BUTTONS = [
  [
    { title: "Bold", name: "bold" },
    { title: "Italic", name: "italic" },
    { title: "Underline", name: "underline" },
    { title: "Strike", name: "strike" },
    { title: "Blockquote", name: "blockquote" },
    { title: "Code Block", name: "code-block" },
  ],
  [
    { title: "Sub", name: "script", value: "sub" },
    { title: "Super", name: "script", value: "super" },
  ],
  [
    { title: "Ordered List", name: "list", value: "ordered" },
    { title: "Bullet List", name: "list", value: "bullet" },
    { title: "Add Indent", name: "indent", value: "-1" },
    { title: "Subtract Indent", name: "indent", value: "+1" },
    { title: "Direction", name: "direction", value: "rtl" },
  ],
  [
    { title: "Link", name: "link" },
    { title: "Image", name: "image" },
    { title: "Video", name: "video" },
  ],
  [{ title: "Clear Styles", name: "clean" }],
]

const renderButtonGroup = (key, buttons) => (
  <QuillGroup key={key}>{renderButtons(buttons)}</QuillGroup>
)

const renderButtons = (buttons) =>
  buttons.map((button, i) => {
    if (Array.isArray(button)) {
      return renderButtonGroup(i, button)
    } else {
      const { name, value, title } = button
      return (
        <button key={i} title={title} className={`ql-${name}`} value={value} />
      )
    }
  })

const QuillButtons = () => renderButtons(BUTTONS)

export default memo(QuillButtons)
