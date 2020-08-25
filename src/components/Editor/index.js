import React, { PureComponent, Fragment, createRef } from "react"
import ReactQuill from "react-quill"
import { THEMES, FORMATS, getModules } from "./modules"
import "react-quill/dist/quill.snow.css"
import "react-quill/dist/quill.bubble.css"
import "react-quill/dist/quill.core.css"
// import "quill-emoji/dist/quill-emoji.css"
// import "quill-mention/dist/quill.mention.min.css"
import "./styles.css"
import TopToolbar from "./TopToolbar"
import BottomToolbar from "./BottomToolbar"
import PropTypes from "prop-types"
import { EntryPropTypes } from "store/reducers/Entries/propTypes"
import deepEquals from "utils/deepEquals"

class Editor extends PureComponent {
  constructor(props) {
    super(props)

    const {
      entry,
      toolbarId,
      theme,
      topToolbarIsOpen,
      bottomToolbarIsOpen,
      canToggleToolbars,
      readOnly,
    } = props

    this.editorRef = createRef()
    const newToolbarId = `toolbar-${toolbarId}`
    const modules = getModules(newToolbarId, topToolbarIsOpen)

    this.state = {
      entry,
      quillId: toolbarId.toString(),
      toolbarId: newToolbarId,
      theme,
      topToolbarIsOpen: !readOnly && topToolbarIsOpen,
      bottomToolbarIsOpen: !readOnly && bottomToolbarIsOpen,
      canToggleToolbars: !readOnly && canToggleToolbars,
      modules,
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
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
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
    readOnly: false,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { entry, readOnly } = nextProps

    const { topToolbarIsOpen, bottomToolbarIsOpen } = prevState

    const editorHeight = readOnly
      ? "100%"
      : bottomToolbarIsOpen
      ? "calc(100vh - var(--navBarHeight) - var(--inputHeight) - var(--topToolbarHeight) - var(--bottomToolbarHeight) - var(--bottomToolBarToggleContainerHeight))"
      : "calc(100vh - var(--navBarHeight) - var(--inputHeight) - var(--topToolbarHeight) - var(--bottomToolBarToggleContainerHeight))"

    const editorStyles = { height: editorHeight }

    const previousState = {
      entry: prevState.entry,
      editorStyles: prevState.editorStyles,
    }

    const nextState = {
      entry,
      editorStyles,
    }

    if (!deepEquals(previousState, nextState)) {
      return nextState
    }

    return null
  }

  handleEditorStateChange = (html, delta, source, editor) => {
    // console.log("delta: ", delta)
    // console.log("source: ", source)
    // console.log("editor: ", editor)
    // if (source === "user") {
    this.handleEditorChange({ html })
    // }
  }

  handleEditorChange = ({ ...payload }) => {
    const { toolbarId, onChangeCallback } = this.props

    onChangeCallback({ id: toolbarId, ...payload })
  }

  toggleBottomToolbar = (toggle) =>
    this.setState((currentState) => ({
      bottomToolbarIsOpen:
        toggle === true || toggle === false
          ? toggle
          : !currentState.bottomToolbarIsOpen,
    }))

  handleOnFocus = (range) => {
    const { editorRef } = this

    if (editorRef && editorRef.current) {
      editorRef.current.setEditorSelection(editorRef.current.editor, range)
    }
  }

  render() {
    const { editorRef } = this
    const { children, height, width, placeholder, readOnly } = this.props
    const {
      toolbarId,
      entry,
      theme,
      quillId,
      topToolbarIsOpen,
      editorStyles,
      bottomToolbarIsOpen,
      modules,
      canToggleToolbars,
    } = this.state

    return (
      <Fragment>
        {children}
        <div id="TextEditor" style={{ height, width }}>
          <TopToolbar
            toolbarId={toolbarId}
            editorRef={editorRef}
            isOpen={topToolbarIsOpen}
            onChangeCallback={this.handleEditorChange}
          />
          <ReactQuill
            id={quillId}
            readOnly={readOnly}
            bounds="app"
            ref={editorRef}
            className="Editor"
            style={editorStyles}
            theme={theme}
            formats={FORMATS}
            modules={modules}
            value={entry.html}
            onChange={this.handleEditorStateChange}
            placeholder={placeholder}
            onFocus={this.handleOnFocus}
          />
          <BottomToolbar
            entry={entry}
            canToggleToolbars={canToggleToolbars}
            isOpen={bottomToolbarIsOpen}
            toggleBottomToolbar={this.toggleBottomToolbar}
            onChangeCallback={this.handleEditorChange}
            id={this.props.toolbarId}
            editorRef={editorRef}
          />
        </div>
      </Fragment>
    )
  }
}
export default Editor
