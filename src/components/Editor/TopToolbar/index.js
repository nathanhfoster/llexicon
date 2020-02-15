import React, { memo } from "react"
import PropTypes from "prop-types"
import Headers from "./QuillSelect/Headers"
import Sizes from "./QuillSelect/Sizes"
import QuillButtons from "./QuillButtons"
import Backgrounds from "./QuillSelect/Backgrounds"
import Colors from "./QuillSelect/Colors"
import Align from "./QuillSelect/Align"
import Fonts from "./QuillSelect/Fonts"
import { DEFAULT_STATE_TEXT_EDITOR } from "../../../redux/TextEditor/reducer"
import deepEquals from "../../../helpers/deepEquals"
import "./styles.css"

const { html } = DEFAULT_STATE_TEXT_EDITOR

const TopToolbar = ({ toolbarId, editorRef, onChangeCallback }) => {
  const handleUndo = () => editorRef.current.editor.history.undo()
  const handleRedo = () => editorRef.current.editor.history.redo()
  const handleClear = () => onChangeCallback({ html })

  return (
    <div id={toolbarId}>
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
      </span>
    </div>
  )
}

TopToolbar.propTypes = {
  toolbarId: PropTypes.PropTypes.string.isRequired,
  editorRef: PropTypes.object,
  onChangeCallback: PropTypes.func.isRequired
}

const isEqual = (prevProps, nextProps) =>
  deepEquals(prevProps.editorRef, nextProps.editorRef)

export default memo(TopToolbar, isEqual)
