import React, { PureComponent, Fragment, createRef } from "react"
import PropTypes from "prop-types"
import ReactQuill, { Quill } from "react-quill"
import ImageResize from "quill-image-resize-module-react"
import Toolbar from "./Toolbar"
import Divider from "../Divider"
import "react-quill/dist/quill.snow.css"
import "react-quill/dist/quill.bubble.css"
import "react-quill/dist/quill.core.css"
// import "quill-emoji/dist/quill-emoji.css"
// import "quill-mention/dist/quill.mention.min.css"
import "./styles.css"

// const Size = Quill.import("formats/size")
// Size.whitelist = ["extra-small", "small", "medium", "large"]
// Quill.register(Size, true)

const Font = Quill.import("formats/font")
Font.whitelist = [
  "roboto",
  "arial",
  "comic-sans",
  "courier-new",
  "georgia",
  "helvetica",
  "lucida"
]

Quill.register(Font, true)

Quill.register("modules/imageResize", ImageResize)

const THEMES = {
  CORE: "core",
  SNOW: "snow",
  BUBBLE: "bubble"
}

class Editor extends PureComponent {
  constructor(props) {
    super(props)

    this.toolbarId = `toolbar-${props.toolbarId}`

    this.editorRef = createRef()

    this.state = {}
  }

  static getDerivedStateFromProps(props, state) {
    // console.log("props: ", props)
    // console.log("state: ", state)
    return props
  }

  static propTypes = {
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    html: PropTypes.string.isRequired,
    onChangeCallback: PropTypes.func,
    showDivider: PropTypes.bool,
    toolbarId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
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
    theme: PropTypes.string,
    modules: PropTypes.object,
    formats: PropTypes.array,
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
  }

  static defaultProps = {
    theme: THEMES.SNOW,

    height: "100%",
    width: "100%",
    showDivider: false,

    toolbarId: 1
  }

  componentDidMount() {
    // console.log(this.editorRef)
    // console.log(this.editorRef.current.editor.history)
  }

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  handleEditorStateChange = html => {
    const { onChangeCallback } = this.props

    onChangeCallback(html)
  }

  getModules = ({ toolbarId, editorRef }) => {
    return {
      history: {
        delay: 2000,
        maxStack: 500,
        userOnly: false
      },
      toolbar: `#${toolbarId}`,
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

  getFormats = ({}) => {
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

  render() {
    const { toolbarId, editorRef } = this
    const { children } = this.props
    const { html, theme, height, width, showDivider } = this.state

    return (
      <Fragment>
        {children}
        <div className="text-editor" style={{ height, width }}>
          <Toolbar toolbarId={toolbarId} editorRef={editorRef} />
          <ReactQuill
            id={this.props.toolbarId}
            bounds={"app"}
            ref={editorRef}
            className="Editor"
            theme={theme}
            modules={this.getModules(this)}
            formats={this.getFormats(this)}
            value={html}
            onChange={this.handleEditorStateChange}
          />
        </div>
        {showDivider && <Divider />}
      </Fragment>
    )
  }
}
export default Editor
