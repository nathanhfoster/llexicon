import React, { memo } from "react"
import PropTypes from "prop-types"
import { Collapse } from "reactstrap"
import Headers from "./QuillSelect/Headers"
import Sizes from "./QuillSelect/Sizes"
import QuillButtons from "./QuillButtons"
import Backgrounds from "./QuillSelect/Backgrounds"
import Colors from "./QuillSelect/Colors"
import Align from "./QuillSelect/Align"
import Fonts from "./QuillSelect/Fonts"
import { DEFAULT_STATE_TEXT_EDITOR } from "reducers//TextEditor/reducer"
import "./styles.css"

const { html } = DEFAULT_STATE_TEXT_EDITOR

const TopToolbar = ({ toolbarId, editorRef, isOpen, onChangeCallback }) => {
  const editorSelection =
    editorRef && editorRef.current
      ? editorRef.current.getEditorSelection()
      : null
  const handleUndo = () => editorRef.current.editor.history.undo()
  const handleRedo = () => editorRef.current.editor.history.redo()
  const handleClear = () => onChangeCallback({ html })
  const handleGetTAble = () => {
    // module.insertTable(3, 3)
  }

  return (
    <Collapse id={toolbarId} isOpen={isOpen}>
      <span className="ql-formats">
        <Align />
        <Fonts />
        <Headers />
        <Sizes />
        <Colors />
        <Backgrounds />
      </span>

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
  onChangeCallback: PropTypes.func.isRequired,
}

export default memo(TopToolbar)
