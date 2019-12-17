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

// const Size = Quill.import("formats/size")
// Size.whitelist = ["extra-small", "small", "medium", "large"]
// Quill.register(Size, true)

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

Quill.register(Font, true)

Quill.register("modules/imageResize", ImageResize)

// Quill.setAttribute('spellcheck', true)

const THEMES = {
  CORE: "core",
  SNOW: "snow",
  BUBBLE: "bubble"
}

class Editor extends Component {
  constructor(props) {
    super(props)

    const { toolbarId, html, theme } = props

    this.toolbarId = `toolbar-${toolbarId}`

    this.editorRef = createRef()

    this.state = {
      quillId: toolbarId.toString(),
      html,
      theme
    }
  }

  static propTypes = {
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    html: PropTypes.string.isRequired,
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
    theme: PropTypes.string,
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
      html,
      latitude,
      longitude,
      tags,
      EntryFiles,
      topToolbarHidden,
      bottomToolbarHidden
    } = nextProps

    const editorHeight = bottomToolbarHidden
      ? "calc(100% - var(--topToolbarHeight))"
      : "calc(100% - var(--topToolbarHeight) - var(--bottomToolbarHeight))"

    return {
      html,
      latitude,
      longitude,
      tags,
      EntryFiles,
      topToolbarHidden,
      editorHeight,
      bottomToolbarHidden
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { children } = this.props
    const nextChildren = nextProps.children

    const childrenChanged = !deepEquals(children, nextChildren)
    const stateChanged = !deepEquals(this.state, nextState)

    return stateChanged || childrenChanged
  }

  componentDidMount() {
    // console.log(this.editorRef)
    // console.log(this.editorRef.current.editor.history)
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // console.log("getSnapshotBeforeUpdate: ", prevProps)
    return null
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // console.log("componentDidUpdate: ", snapshot)
  }

  componentWillUnmount() {}

  handleEditorStateChange = html => {
    const { onChangeCallback } = this.props

    onChangeCallback({ html })
  }

  getModules = ({
    toolbarId,
    editorRef,
    props: {},
    state: { topToolbarHidden }
  }) => {
    return {
      history: {
        delay: 2000,
        maxStack: 500,
        userOnly: false
      },
      toolbar: topToolbarHidden ? null : `#${toolbarId}`,
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
    const {
      children,
      onChangeCallback,
      height,
      width,
      placeholder
    } = this.props
    const {
      html,
      latitude,
      longitude,
      tags,
      EntryFiles,
      theme,
      quillId,
      topToolbarHidden,
      editorHeight,
      bottomToolbarHidden
    } = this.state

    return (
      <Fragment>
        {children}
        <div className="text-editor" style={{ height, width }}>
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
            modules={this.getModules(this)}
            formats={this.getFormats(this)}
            value={html}
            onChange={this.handleEditorStateChange}
            placeholder={placeholder}
          />
          {!bottomToolbarHidden && (
            <BottomToolbar
              onChangeCallback={({ ...payload }) =>
                onChangeCallback({ id: this.props.toolbarId, ...payload })
              }
              id={this.props.toolbarId}
              html={html}
              latitude={latitude}
              longitude={longitude}
              tags={tags}
              EntryFiles={EntryFiles}
            />
          )}
        </div>
      </Fragment>
    )
  }
}
export default Editor
