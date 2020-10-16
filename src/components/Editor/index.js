import React, { useRef, useState, useMemo, useCallback, Fragment, memo } from 'react'
import ReactQuill from 'react-quill'
import { THEMES, FORMATS, getModules } from './modules'
import 'react-quill/dist/quill.snow.css'
import 'react-quill/dist/quill.bubble.css'
import 'react-quill/dist/quill.core.css'
// import "quill-emoji/dist/quill-emoji.css"
// import "quill-mention/dist/quill.mention.min.css"
import './styles.css'
import TopToolbar from './TopToolbar'
import BottomToolbar from './BottomToolbar'
import PropTypes from 'prop-types'
import { EntryPropTypes } from '../../redux/Entries/propTypes'

const Editor = ({
  children,
  entry,
  theme,
  height,
  width,
  placeholder,
  readOnly,
  onChange,
  ...restOfProps
}) => {
  const editorRef = useRef()

  const [bottomToolbarIsOpen, setBottomToolbarIsOpen] = useState(
    !readOnly && restOfProps.bottomToolbarIsOpen,
  )

  const toolbarId = useMemo(() => `toolbar-${restOfProps.toolbarId}`, [restOfProps.toolbarId])

  const quillId = useMemo(() => toolbarId.toString(), [toolbarId])

  const modules = useMemo(() => getModules(toolbarId, restOfProps.topToolbarIsOpen), [
    toolbarId,
    restOfProps.topToolbarIsOpen,
  ])

  const topToolbarIsOpen = useMemo(() => !readOnly && restOfProps.topToolbarIsOpen, [
    readOnly,
    restOfProps.topToolbarIsOpen,
  ])

  const canToggleToolbars = useMemo(() => !readOnly && restOfProps.canToggleToolbars, [
    readOnly,
    restOfProps.canToggleToolbars,
  ])

  const editorStyles = useMemo(
    () => ({
      height: readOnly
        ? '100%'
        : bottomToolbarIsOpen
        ? 'calc(100vh - var(--navBarHeight) - var(--inputHeight) - var(--topToolbarHeight) - var(--bottomToolbarHeight) - var(--bottomToolBarToggleContainerHeight))'
        : 'calc(100vh - var(--navBarHeight) - var(--inputHeight) - var(--topToolbarHeight) - var(--bottomToolBarToggleContainerHeight))',
    }),
    [readOnly, bottomToolbarIsOpen],
  )

  const handleEditorChange = useCallback(
    ({ ...payload }) => onChange({ id: restOfProps.toolbarId, ...payload }),
    [restOfProps.toolbarId],
  )

  const handleEditorStateChange = useCallback((html, delta, source, editor) => {
    handleEditorChange({ html })
  }, [])

  const toggleBottomToolbar = useCallback(
    toggle =>
      setBottomToolbarIsOpen(currentState =>
        toggle === true || toggle === false ? toggle : !currentState,
      ),
    [],
  )

  const handleOnFocus = useCallback(
    range => {
      if (editorRef && editorRef.current) {
        editorRef.current.setEditorSelection(editorRef.current.editor, range)
      }
    },
    [editorRef],
  )

  const handleUndo = useCallback(() => editorRef?.current?.editor?.history.undo(), [editorRef])

  const handleRedo = useCallback(() => editorRef?.current?.editor?.history.redo(), [editorRef])

  return (
    <Fragment>
      {children}
      <div id='TextEditor' style={{ height, width }}>
        <TopToolbar
          toolbarId={toolbarId}
          editorRef={editorRef}
          isOpen={topToolbarIsOpen}
          handleUndo={handleUndo}
          handleRedo={handleRedo}
          handleEditorChange={handleEditorChange}
        />
        <ReactQuill
          id={quillId}
          readOnly={readOnly}
          bounds='app'
          ref={editorRef}
          className='Editor'
          style={editorStyles}
          theme={theme}
          formats={FORMATS}
          modules={modules}
          value={entry.html}
          onChange={handleEditorStateChange}
          placeholder={placeholder}
          onFocus={handleOnFocus}
        />
        <BottomToolbar
          entry={entry}
          canToggleToolbars={canToggleToolbars}
          isOpen={bottomToolbarIsOpen}
          toggleBottomToolbar={toggleBottomToolbar}
          handleEditorChange={handleEditorChange}
          id={restOfProps.toolbarId}
        />
      </div>
    </Fragment>
  )
}

Editor.propTypes = {
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  entry: EntryPropTypes.isRequired,
  onChange: PropTypes.func,
  toolbarId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
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

Editor.defaultProps = {
  theme: THEMES.SNOW,
  height: '100%',
  width: '100%',
  toolbarId: 1,
  placeholder: 'Today I have...',
  canToggleToolbars: true,
  topToolbarIsOpen: true,
  bottomToolbarIsOpen: true,
  readOnly: false,
}
export default memo(Editor)
