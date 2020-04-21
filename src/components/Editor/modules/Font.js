import { Quill } from "react-quill"

const Font = Quill.import("formats/font")
Font.whitelist = [
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

export default Font
