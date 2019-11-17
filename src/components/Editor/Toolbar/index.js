import React from "react"
import PropTypes from "prop-types"
import Group from "./Group"
import Headers from "./QuillSelect/Headers"
import QuillButtons from "./QuillButtons"
import Backgrounds from "./QuillSelect/Backgrounds"
import Colors from "./QuillSelect/Colors"
import Align from "./QuillSelect/Align"
import Fonts from "./QuillSelect/Fonts"
import "./styles.css"

const undo = editorRef => editorRef.current.editor.history.undo()
const redo = editorRef => editorRef.current.editor.history.redo()

const Toolbar = ({ toolbarId, editorRef }) => {
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
          <i className="fas fa-undo-alt"></i>
        </button>
        <button className="ql-undo" onClick={() => redo(editorRef)}>
          <i className="fas fa-redo-alt"></i>
        </button>
      </Group>
    </div>
  )
}

Toolbar.propTypes = {
  toolbarId: PropTypes.PropTypes.string.isRequired,
  editorRef: PropTypes.object
}

export default Toolbar
