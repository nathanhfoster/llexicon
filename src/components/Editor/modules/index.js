import { Quill } from "react-quill"
import ImageResize from "quill-image-resize-module-react"
// import * as QuillTableUI from "quill-table-ui"
import Font from "./Font"
import Size from "./Size"
import Video from "./Video"

Quill.register(Size, true)
Quill.register(Font, true)
Quill.register("formats/video", Video)
Quill.register({ "modules/imageResize": ImageResize }, true)
// Quill.register({ "modules/tableUI": QuillTableUI }, true)
// Quill.setAttribute('spellcheck', true)

const THEMES = {
  CORE: "core",
  SNOW: "snow",
  BUBBLE: "bubble",
}

const FORMATS = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "color",
  "background",
  "font",
  "code",
  "size",
  "script",
  "align",
  "direction",
  "code-block",
  "image",
  "video",
  "alt",
  "height",
  "width",
  "style",
  "size",
]

const getModules = (toolbarId, topToolbarIsOpen) => ({
  history: {
    delay: 2000,
    maxStack: 500,
    userOnly: false,
  },
  toolbar: topToolbarIsOpen ? `#${toolbarId}` : false,
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: true,
  },
  imageResize: {
    parchment: Quill.import("parchment"),
    // See optional "config" below
  },
  // table: true,
  // tableUI: true,
  // imageDrop: {}
})

export { THEMES, FORMATS, getModules }
