import { Quill } from "react-quill"

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
  // imageDrop: {}
})

export { THEMES, FORMATS, getModules }

export { default as Font } from "./Font"
export { default as Size } from "./Size"
export { default as Video } from "./Video"
