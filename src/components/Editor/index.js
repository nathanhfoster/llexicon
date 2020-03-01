import React, { PureComponent, Fragment, createRef } from "react"
import PropTypes from "prop-types"
import { EntryPropTypes } from "../../redux/Entries/propTypes"
import ReactQuill, { Quill } from "react-quill"
import { Collapse } from "reactstrap"
import ImageResize from "quill-image-resize-module-react"
import "react-quill/dist/quill.snow.css"
import "react-quill/dist/quill.bubble.css"
import "react-quill/dist/quill.core.css"
// import "quill-emoji/dist/quill-emoji.css"
// import "quill-mention/dist/quill.mention.min.css"
import "./styles.css"
import TopToolbar from "./TopToolbar"
import BottomToolbar from "./BottomToolbar"

const BlockEmbed = Quill.import("blots/block/embed")

class Video extends BlockEmbed {
  static create(value) {
    let node = super.create(value)
    let iframe = document.createElement("iframe")
    iframe.setAttribute("frameborder", "0")
    iframe.setAttribute("allowfullscreen", true)

    // iframe.setAttribute("height", 320)
    // iframe.setAttribute("width", "100%")

    // console.log(document.getElementById("TextEditor").offsetWidth)

    if (value.includes("watch?v=")) {
      value = value.replace("watch?v=", "embed/")
    }

    if (value.includes("/watch/")) {
      value = value.replace("/watch/", "/embed/")
    }

    if (value.includes("youtu.be/")) {
      value = value.replace("youtu.be/", "youtube.com/embed/")
    }

    iframe.setAttribute("src", value)
    node.appendChild(iframe)
    return node
  }

  static value(domNode) {
    if (domNode.firstChild) {
      return domNode.firstChild.getAttribute("src")
    }
  }
}

Video.blotName = "video"
Video.className = "ql-video"
Video.tagName = "div"

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
  "72px"
]

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
  "lucida"
]

Quill.register(Size, true)

Quill.register(Font, true)

Quill.register("modules/imageResize", ImageResize)

Quill.register("formats/video", Video)

// Quill.setAttribute('spellcheck', true)

const THEMES = {
  CORE: "core",
  SNOW: "snow",
  BUBBLE: "bubble"
}

const getModules = (toolbarId, topToolbarIsOpen) => {
  return {
    history: {
      delay: 2000,
      maxStack: 500,
      userOnly: false
    },
    toolbar: topToolbarIsOpen ? `#${toolbarId}` : false,
    // toolbar: {
    //   container: [
    //     ["bold", "italic", "underline", "strike"], // toggled buttons
    //     ["blockquote", "code-block"],

    //     // [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    //     // [{ header: 1 }, { header: 2 }], // custom button values
    //     [{ header: [1, 2, 3, 4, 5, false] }],

    //     [{ list: "ordered" }, { list: "bullet" }],
    //     [{ script: "sub" }, { script: "super" }], // superscript/subscript
    //     [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    //     [{ direction: "rtl" }], // text direction

    //     [{ color: [] }, { background: [] }], // dropdown with defaults from theme

    //     [{ align: [] }, { font: [] }],
    //     ["link", "image", "video"],
    //     ["clean"],
    //     ["undo", "redo"]
    //   ],

    //   // https://github.com/zenoamaro/react-quill/issues/436
    //   handlers: {
    //     undo: () => {
    //       editorRef.current.editor.history.undo()
    //     },
    //     redo: () => {
    //       editorRef.current.editor.history.undo()
    //     }
    //     // image: () => {
    //     //   this.showImageUploadModal();
    //     // },
    //     // video: () => {
    //     //   this.showVideoUploadModal()
    //     // },
    //     // insertImage: this.insertImage,
    //   }
    // },
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false
    },
    imageResize: {
      parchment: Quill.import("parchment")
      // See optional "config" below
    }
    // imageDrop: {}
  }
}

const getFormats = ({}) => {
  return [
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
    "size"
  ]
}

class Editor extends PureComponent {
  constructor(props) {
    super(props)

    const { toolbarId, theme, topToolbarIsOpen, bottomToolbarIsOpen } = props

    this.editorRef = createRef()

    this.state = {
      quillId: toolbarId.toString(),
      theme,
      topToolbarIsOpen,
      bottomToolbarIsOpen
    }
  }

  static propTypes = {
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    entry: EntryPropTypes.isRequired,
    onChangeCallback: PropTypes.func,
    toolbarId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    canToggleToolbars: PropTypes.bool.isRequired,
    topToolbarIsOpen: PropTypes.bool,
    bottomToolbarIsOpen: PropTypes.bool,

    // Quill
    id: PropTypes.string,
    className: PropTypes.string,
    theme: PropTypes.string,
    style: PropTypes.instanceOf(React.CSSProperties),
    readOnly: PropTypes.bool,
    value: PropTypes.string,
    defaultValue: PropTypes.string,
    placeholder: PropTypes.string,
    tabIndex: PropTypes.number,
    bounds: PropTypes.string,
    scrollingContainer: PropTypes.string,
    onChange: PropTypes.func,
    onChangeSelection: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onKeyPress: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyUp: PropTypes.func,
    modules: PropTypes.object,
    formats: PropTypes.array,
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
  }

  static defaultProps = {
    theme: THEMES.SNOW,

    height: "100%",
    width: "100%",
    toolbarId: 1,
    placeholder: "Today I have...",
    canToggleToolbars: true,
    topToolbarIsOpen: true,
    bottomToolbarIsOpen: true,
    readOnly: false
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { entry } = nextProps

    const { topToolbarIsOpen, bottomToolbarIsOpen } = prevState

    const toolbarId = `toolbar-${nextProps.toolbarId}`

    const formats = getFormats(nextProps)
    const modules = getModules(toolbarId, topToolbarIsOpen)

    const editorHeight = bottomToolbarIsOpen
      ? "calc(100% - var(--topToolbarHeight) - var(--bottomToolbarHeight))"
      : "calc(100% - var(--topToolbarHeight))"

    return {
      toolbarId,
      entry,
      editorHeight,
      formats,
      modules
    }
  }

  handleEditorStateChange = html => {
    const { onChangeCallback } = this.props

    onChangeCallback({ html })
  }

  handleBottomToolBarOnChange = ({ ...payload }) => {
    const { toolbarId, onChangeCallback } = this.props
    onChangeCallback({ id: toolbarId, ...payload })
  }

  toggleBottomToolbar = () =>
    this.setState(currentState => ({
      bottomToolbarIsOpen: !currentState.bottomToolbarIsOpen
    }))

  render() {
    const { editorRef } = this
    const {
      children,
      onChangeCallback,
      height,
      width,
      placeholder,
      readOnly,
      canToggleToolbars
    } = this.props
    const {
      toolbarId,
      entry,
      theme,
      quillId,
      topToolbarIsOpen,
      editorHeight,
      bottomToolbarIsOpen,
      formats,
      modules
    } = this.state

    return (
      <Fragment>
        {children}
        <div id="TextEditor" style={{ height, width }}>
          <TopToolbar
            toolbarId={toolbarId}
            editorRef={editorRef}
            isOpen={topToolbarIsOpen}
            onChangeCallback={onChangeCallback}
          />
          <ReactQuill
            id={quillId}
            readOnly={readOnly}
            bounds={"app"}
            ref={editorRef}
            className="Editor"
            style={{ height: editorHeight }}
            theme={theme}
            formats={formats}
            modules={modules}
            value={entry.html}
            onChange={this.handleEditorStateChange}
            placeholder={placeholder}
          />
          <BottomToolbar
            entry={entry}
            canToggleToolbars={canToggleToolbars}
            isOpen={bottomToolbarIsOpen}
            toggleBottomToolbar={this.toggleBottomToolbar}
            onChangeCallback={this.handleBottomToolBarOnChange}
            id={this.props.toolbarId}
            editorRef={editorRef}
          />
        </div>
      </Fragment>
    )
  }
}
export default Editor
