import { Quill } from "react-quill"
import { HEADER_OPTIONS } from "../TopToolbar/QuillSelectButtons/Headers"
import { SIZE_OPTIONS } from "../TopToolbar/QuillSelectButtons/Sizes"

const Size = Quill.import("attributors/style/size")

Size.whitelist = HEADER_OPTIONS.concat(SIZE_OPTIONS)

export default Size
