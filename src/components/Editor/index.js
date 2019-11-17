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

Quill.register("modules/imageResize", ImageResize)

const THEMES = {
  CORE: "core",
  SNOW: "snow",
  BUBBLE: "bubble"
}

class Editor extends PureComponent {
  constructor(props) {
    super(props)

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
    modules: {
      history: {
        delay: 2000,
        maxStack: 500,
        userOnly: false
      },
      // toolbar: "#toolbar",
      toolbar: {
        container: [
          ["bold", "italic", "underline", "strike"], // toggled buttons
          ["blockquote", "code-block"],

          // [{ size: ["small", false, "large", "huge"] }], // custom dropdown
          // [{ header: 1 }, { header: 2 }], // custom button values
          [{ header: [1, 2, 3, 4, 5, false] }],

          [{ list: "ordered" }, { list: "bullet" }],
          [{ script: "sub" }, { script: "super" }], // superscript/subscript
          [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
          [{ direction: "rtl" }], // text direction

          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          ["link", "image", "video"],
          ["clean"],
          ["undo", "redo"]
        ],

        // https://github.com/zenoamaro/react-quill/issues/436
        handlers: {
          undo: () => {
            console.log("CLICKed: ", this.editorRef)

            this.editorRef.current.editor.history.undo()
          },
          redo: () => {
            this.editorRef.current.editor.history.undo()
          }
          // image: () => {
          //   this.showImageUploadModal();
          // },
          // video: () => {
          //   this.showVideoUploadModal()
          // },
          // insertImage: this.insertImage,
        }
      },
      clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false
      },
      imageResize: {
        parchment: Quill.import("parchment")
        // See optional "config" below
      }
      // imageDrop: {}
    },

    formats: [
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
    ],
    height: "100%",
    width: "100%",
    showDivider: false
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

  render() {
    const { children } = this.props
    const {
      html,
      theme,
      modules,
      formats,
      height,
      width,
      showDivider
    } = this.state
    return (
      <Fragment>
        {children}
        <div className="text-editor" style={{ height, width }}>
          <ReactQuill
            bounds={".app"}
            ref={this.editorRef}
            className="Editor"
            theme={theme}
            modules={modules}
            formats={formats}
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
