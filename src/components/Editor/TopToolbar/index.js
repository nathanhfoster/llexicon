import React, { useCallback, memo } from "react"
import PropTypes from "prop-types"
import { Collapse } from "reactstrap"
import Headers from "./QuillSelectButtons/Headers"
import Sizes from "./QuillSelectButtons/Sizes"
import QuillSelectButtons from "./QuillSelectButtons"
import QuillButtons from "./QuillButtons"
import { DEFAULT_STATE_TEXT_EDITOR } from "../../../redux/TextEditor/reducer"
import "./styles.css"

const { html } = DEFAULT_STATE_TEXT_EDITOR

const TopToolbar = ({ toolbarId, editorRef, isOpen, onChange }) => {
  const handleUndo = useCallback(
    () => editorRef?.current?.editor?.history.undo(),
    [editorRef]
  )
  const handleRedo = useCallback(
    () => editorRef?.current?.editor?.history.redo(),
    [editorRef]
  )
  const handleClear = useCallback(() => onChange({ html }), [])
  
  const handleGetTAble = useCallback(() => {
    // module.insertTable(3, 3)
  }, [])

  return (
    <Collapse id={toolbarId} isOpen={isOpen}>
      <QuillSelectButtons />
      <QuillButtons />

      <span className="ql-formats">
        <button className="ql-undo" onClick={handleUndo}>
          <i className="fas fa-undo-alt" />
        </button>
        <button className="ql-undo" onClick={handleRedo}>
          <i className="fas fa-redo-alt" />
        </button>
        <button className="ql-clear" onClick={handleClear}>
          <i className="fas fa-times-circle" />
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
  editorRef: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default memo(TopToolbar)
