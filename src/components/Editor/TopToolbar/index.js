import React, { useCallback, useContext, memo } from "react"
import PropTypes from "prop-types"
import { Collapse } from "reactstrap"
import QuillSelectButtons from "./QuillSelectButtons"
import QuillButtons from "./QuillButtons"
import QuillGroup from "./QuillGroup"
import { EditorConsumer } from "../"
import "./styles.css"

const TopToolbar = ({ toolbarId, isOpen }) => {
  const { editorRef, handleEditorChange, toggleSetShowRaw } = useContext(
    EditorConsumer
  )
  const handleUndo = useCallback(
    () => editorRef?.current?.editor?.history.undo(),
    [editorRef]
  )

  const handleRedo = useCallback(
    () => editorRef?.current?.editor?.history.redo(),
    [editorRef]
  )

  const handleClear = useCallback(() => {
    const today = new Date()
    handleEditorChange({
      title: "",
      html: "",
      tags: [],
      people: [],
      date_created: today,
      date_created_by_author: today,
      date_updated: today,
      rating: 0,
      address: null,
      latitude: null,
      longitude: null,
      is_public: false,

      // Redux Only
      _lastUpdated: today,
    })
  }, [])

  const handlePrint = () => {
    window.print()
  }

  // const handleGetTAble = useCallback(() => {
  //   module.insertTable(3, 3)
  // }, [])

  return (
    <Collapse id={toolbarId} isOpen={isOpen}>
      <QuillSelectButtons />
      <QuillButtons />

      <QuillGroup>
        <button title="Undo" className="ql-undo" onClick={handleUndo}>
          <i className="fas fa-undo-alt" />
        </button>
        <button title="Redo" className="ql-undo" onClick={handleRedo}>
          <i className="fas fa-redo-alt" />
        </button>
        <button title="Clear" className="ql-clear" onClick={handleClear}>
          <i className="fas fa-times-circle" />
        </button>
        <button title="Show Html" onClick={toggleSetShowRaw}>
          <i className="fas fa-file-code"></i>
        </button>
        <button title="Print" onClick={handlePrint}>
          <i class="fas fa-print"></i>
        </button>
        {/* <button className="ql-better-table">
          <i className="fas fa-table" />
        </button> */}
      </QuillGroup>
    </Collapse>
  )
}

TopToolbar.propTypes = {
  toolbarId: PropTypes.PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
}

export default memo(TopToolbar)
