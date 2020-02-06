import React, { Component, Fragment, createRef } from "react"
import PropTypes from "prop-types"
import ReactQuill, { Quill } from "react-quill"
import ImageResize from "quill-image-resize-module-react"
import deepEquals from "../../helpers/deepEquals"
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

const getModules = (toolbarId, topToolbarHidden) => {
  return {
    history: {
      delay: 2000,
      maxStack: 500,
      userOnly: false
    },
    toolbar: topToolbarHidden ? "" : `#${toolbarId}`,
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

class Editor extends Component {
  constructor(props) {
    super(props)

    const { toolbarId, theme } = props

    this.editorRef = createRef()

    this.state = {
      quillId: toolbarId.toString(),
      theme
    }
  }

  static propTypes = {
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    entry: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      clearedOn: PropTypes.string,
      title: PropTypes.string.isRequired,
      html: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      latitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      longitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      tags: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string.isRequired,
          date_created: PropTypes.string.isRequired,
          date_updated: PropTypes.string.isRequired,
          authors: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired
        })
      ).isRequired,
      rating: PropTypes.number.isRequired,
      _lastUpdated: PropTypes.string,
      EntryFiles: PropTypes.arrayOf(
        PropTypes.shape({
          entry_id: PropTypes.number.isRequired,
          file_type: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          size: PropTypes.number.isRequired,
          url: PropTypes.string.isRequired,
          date_created: PropTypes.string.isRequired,
          date_updated: PropTypes.string.isRequired,
          date_modified: PropTypes.string.isRequired
        })
      )
    }).isRequired,
    onChangeCallback: PropTypes.func,
    toolbarId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    topToolbarHidden: PropTypes.bool,
    bottomToolbarHidden: PropTypes.bool,

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
    bounds: PropTypes.oneOfType([PropTypes.string, HTMLElement]),
    scrollingContainer: PropTypes.oneOfType([PropTypes.string, HTMLElement]),
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
    topToolbarHidden: false,
    bottomToolbarHidden: false
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      entry,
      topToolbarHidden,
      bottomToolbarHidden,
      onChangeCallback
    } = nextProps

    const toolbarId = `toolbar-${nextProps.toolbarId}`

    const formats = getFormats(nextProps)
    const modules = getModules(toolbarId, topToolbarHidden)

    const editorHeight = bottomToolbarHidden
      ? "calc(100% - var(--topToolbarHeight))"
      : "calc(100% - var(--topToolbarHeight) - var(--bottomToolbarHeight))"

    return {
      toolbarId,
      entry,
      topToolbarHidden,
      editorHeight,
      bottomToolbarHidden,
      formats,
      modules
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { children } = this.props
    const nextChildren = nextProps.children

    const childrenChanged = !deepEquals(children, nextChildren)
    const stateChanged = !deepEquals(this.state, nextState)

    return stateChanged || childrenChanged
  }

  handleEditorStateChange = html => {
    const { onChangeCallback } = this.props

    onChangeCallback({ html })
  }

  render() {
    const { editorRef } = this
    const {
      children,
      onChangeCallback,
      height,
      width,
      placeholder
    } = this.props
    const {
      toolbarId,
      entry,
      theme,
      quillId,
      topToolbarHidden,
      editorHeight,
      bottomToolbarHidden,
      formats,
      modules
    } = this.state

    return (
      <Fragment>
        {children}
        <div id="TextEditor" style={{ height, width }}>
          {!topToolbarHidden && (
            <TopToolbar
              toolbarId={toolbarId}
              editorRef={editorRef}
              onChangeCallback={onChangeCallback}
            />
          )}
          <ReactQuill
            id={quillId}
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
          {!bottomToolbarHidden && (
            <BottomToolbar
              entry={entry}
              onChangeCallback={({ ...payload }) =>
                onChangeCallback({ id: this.props.toolbarId, ...payload })
              }
              id={this.props.toolbarId}
              editorRef={editorRef}
            />
          )}
        </div>
      </Fragment>
    )
  }
}
export default Editor
