import React, {
  createContext,
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react"
import { connect } from "react-redux"
import { SetBottomToolbarIsOpen } from "redux/TextEditor/actions"
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
import { EntryPropTypes } from "redux/Entries/propTypes"
import RawEditor from "./RawEditor"

export const EditorConsumer = createContext()

const mapStateToProps = ({ TextEditor: { bottomToolbarIsOpen } }) => ({
  bottomToolbarIsOpen,
})

const mapDispatchToProps = { SetBottomToolbarIsOpen }

const Editor = ({
  children,
  entry,
  theme,
  height,
  width,
  placeholder,
  readOnly,
  onChange,
  SetBottomToolbarIsOpen,
  ...restOfProps
}) => {
  const editorRef = useRef()
  const didMount = useRef(false)

  const bottomToolbarIsOpen = !readOnly && restOfProps.bottomToolbarIsOpen

  const [showRaw, setShowRaw] = useState(false)

  const toggleSetShowRaw = useCallback(() => {
    setShowRaw((prevShowRaw) => !prevShowRaw)
  }, [])

  useEffect(() => {
    didMount.current = true
    return () => {
      didMount.current = false
    }
  }, [])

  const toolbarId = useMemo(() => `toolbar-${restOfProps.toolbarId}`, [
    restOfProps.toolbarId,
  ])

  const quillId = useMemo(() => toolbarId.toString(), [toolbarId])

  const modules = useMemo(
    () => getModules(toolbarId, restOfProps.topToolbarIsOpen),
    [toolbarId, restOfProps.topToolbarIsOpen]
  )

  const topToolbarIsOpen = useMemo(
    () => !readOnly && restOfProps.topToolbarIsOpen,
    [readOnly, restOfProps.topToolbarIsOpen]
  )

  const canToggleToolbars = useMemo(
    () => !readOnly && restOfProps.canToggleToolbars,
    [readOnly, restOfProps.canToggleToolbars]
  )

  const editorStyles = useMemo(
    () => ({
      height: readOnly
        ? "calc(100vh - var(--navBarHeight) - var(--inputHeight))"
        : bottomToolbarIsOpen
        ? "calc(100vh - var(--navBarHeight) - var(--inputHeight) - var(--topToolbarHeight) - var(--bottomToolbarHeight) - var(--bottomToolBarToggleContainerHeight))"
        : "calc(100vh - var(--navBarHeight) - var(--inputHeight) - var(--topToolbarHeight) - var(--bottomToolBarToggleContainerHeight))",
    }),
    [readOnly, bottomToolbarIsOpen]
  )

  const handleOnFocus = useCallback(
    (range) => {
      if (editorRef && editorRef.current) {
        editorRef.current.setEditorSelection(editorRef.current.editor, range)
      }
    },
    [editorRef]
  )

  const handleEditorChange = useCallback(
    (fields) => {
      const payload = { id: entry.id, ...fields }
      onChange(payload)
    },
    [entry.id, onChange]
  )

  const handleEditorStateChange = useCallback(
    (html, delta, source, editor) => {
      // console.log('handleEditorStateChange: ', delta, source, editor)
      if (source === "api" && !didMount.current) return
      handleEditorChange({ html })
    },
    [handleEditorChange]
  )

  const toggleBottomToolbar = useCallback(
    (toggle) => {
      SetBottomToolbarIsOpen(
        toggle === true || toggle === false ? toggle : !bottomToolbarIsOpen
      )
    },
    [bottomToolbarIsOpen]
  )

  const editorSelection = editorRef?.current?.getEditorSelection()

  const contextValue = useMemo(
    () => ({
      editorRef,
      editorSelection,
      handleEditorChange,
      toggleBottomToolbar,
      toggleSetShowRaw,
    }),
    [editorRef, editorSelection, handleEditorChange, toggleBottomToolbar]
  )

  return (
    <EditorConsumer.Provider value={contextValue}>
      <div className={showRaw ? "showRaw" : ""}>
        {children}
        <div className="d-print-none">
          <TopToolbar
            toolbarId={toolbarId}
            editorRef={editorRef}
            isOpen={topToolbarIsOpen}
          />
        </div>
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
          defaultValue={entry.html}
          value={entry.html}
          onChange={handleEditorStateChange}
          placeholder={placeholder}
          onFocus={handleOnFocus}
          preserveWhitespace={false}
          tabIndex={0}
        />
        <div className="d-print-none">
          <BottomToolbar
            entry={entry}
            canToggleToolbars={canToggleToolbars}
            isOpen={bottomToolbarIsOpen}
            id={restOfProps.toolbarId}
          />
        </div>
        {showRaw && (
          <RawEditor
            style={editorStyles}
            placeholder={placeholder}
            value={entry.html}
          />
        )}
      </div>
    </EditorConsumer.Provider>
  )
}

Editor.propTypes = {
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  entry: EntryPropTypes.isRequired,
  onChange: PropTypes.func,
  toolbarId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  canToggleToolbars: PropTypes.bool.isRequired,
  topToolbarIsOpen: PropTypes.bool,
  bottomToolbarIsOpen: PropTypes.bool.isRequired,

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

Editor.defaultProps = {
  theme: THEMES.SNOW,
  height: "100%",
  width: "100%",
  toolbarId: 1,
  placeholder: "Today I have...",
  canToggleToolbars: true,
  topToolbarIsOpen: true,
  readOnly: false,
}
export default connect(mapStateToProps, mapDispatchToProps)(Editor)
