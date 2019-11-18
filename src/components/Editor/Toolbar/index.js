import React from "react"
import PropTypes from "prop-types"
import Group from "./Group"
import Headers from "./QuillSelect/Headers"
import QuillButtons from "./QuillButtons"
import Backgrounds from "./QuillSelect/Backgrounds"
import Colors from "./QuillSelect/Colors"
import Align from "./QuillSelect/Align"
import Fonts from "./QuillSelect/Fonts"
import { DEFAULT_STATE_TEXT_EDITOR } from "../../../store/Reducers/TextEditor"
import "./styles.css"

const { editorStateHtml } = DEFAULT_STATE_TEXT_EDITOR

const undo = editorRef => editorRef.current.editor.history.undo()
const redo = editorRef => editorRef.current.editor.history.redo()
// const clear = editorRef => editorRef.current.editor.history.clear()

const Toolbar = ({ toolbarId, editorRef, onChangeCallback }) => {
  return (
    <div id={toolbarId}>
      <Group>
        <Align />
        <Fonts />
        <Headers />
        <Colors />
        <Backgrounds />
      </Group>

      <QuillButtons />

      <Group>
        <button className="ql-undo" onClick={() => undo(editorRef)}>
          <i className="fas fa-undo-alt" />
        </button>
        <button className="ql-undo" onClick={() => redo(editorRef)}>
          <i className="fas fa-redo-alt" />
        </button>
        <button
          className="ql-clear"
          onClick={() => onChangeCallback(editorStateHtml)}
        >
          <i className="fas fa-times-circle" />
        </button>
      </Group>
    </div>
  )
}

Toolbar.propTypes = {
  toolbarId: PropTypes.PropTypes.string.isRequired,
  editorRef: PropTypes.object,
  onChangeCallback: PropTypes.func.isRequired
}

export default Toolbar
