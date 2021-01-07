import React, { useCallback, useContext, memo } from 'react'
import PropTypes from 'prop-types'
import { Collapse } from 'reactstrap'
import Headers from './QuillSelectButtons/Headers'
import Sizes from './QuillSelectButtons/Sizes'
import QuillSelectButtons from './QuillSelectButtons'
import QuillButtons from './QuillButtons'
import { DEFAULT_STATE_TEXT_EDITOR } from 'redux/TextEditor/reducer'
import { EditorConsumer } from '../'
import './styles.css'

const styles = { color: 'white' }

const { html } = DEFAULT_STATE_TEXT_EDITOR

const TopToolbar = ({ toolbarId, isOpen }) => {
  const { editorRef, handleEditorChange, toggleSetShowRaw } = useContext(EditorConsumer)
  const handleUndo = useCallback(() => editorRef?.current?.editor?.history.undo(), [editorRef])

  const handleRedo = useCallback(() => editorRef?.current?.editor?.history.redo(), [editorRef])

  const handleClear = useCallback(() => handleEditorChange({ html }), [])

  // const handleGetTAble = useCallback(() => {
  //   module.insertTable(3, 3)
  // }, [])

  return (
    <Collapse id={toolbarId} isOpen={isOpen}>
      <QuillSelectButtons />
      <QuillButtons />

      <span className='ql-formats' style={styles}>
        <button className='ql-undo' onClick={handleUndo}>
          <i className='fas fa-undo-alt' />
        </button>
        <button className='ql-undo' onClick={handleRedo}>
          <i className='fas fa-redo-alt' />
        </button>
        <button className='ql-clear' onClick={handleClear}>
          <i className='fas fa-times-circle' />
        </button>
        <button onClick={toggleSetShowRaw}>
          <i className='fas fa-file-code'></i>
        </button>
        {/* <button className="ql-better-table">
          <i className="fas fa-table" />
        </button> */}
      </span>
    </Collapse>
  )
}

TopToolbar.propTypes = {
  toolbarId: PropTypes.PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
}

export default memo(TopToolbar)
