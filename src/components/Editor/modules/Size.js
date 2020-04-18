import { Quill } from "react-quill"

const Size = Quill.import("attributors/style/size")
Size.whitelist = [
  "Header 1",
  "Header 2",
  "Header 3",
  "Header 4",
  "Header 5",
  "8px",
  "9px",
  "10px",
  "11px",
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "22px",
  "24px",
  "26px",
  "28px",
  "36px",
  "48px",
  "72px",
]

export default Size
