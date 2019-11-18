import React, { Component } from "react"
import PropTypes from "prop-types"
import Group from "./Group"
import Headers from "./QuillSelect/Headers"
import Sizes from "./QuillSelect/Sizes"
import QuillButtons from "./QuillButtons"
import Backgrounds from "./QuillSelect/Backgrounds"
import Colors from "./QuillSelect/Colors"
import Align from "./QuillSelect/Align"
import Fonts from "./QuillSelect/Fonts"
import { DEFAULT_STATE_TEXT_EDITOR } from "../../../store/Reducers/TextEditor"
import deepEquals from "../../../helpers/deepEquals"
import "./styles.css"

const { editorStateHtml } = DEFAULT_STATE_TEXT_EDITOR

class Toolbar extends Component {
  constructor(props) {
    super(props)
    this.state = { ...props }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const editorRefChanged = !deepEquals(
      nextProps.editorRef,
      prevState.editorRef
    )

    if (editorRefChanged) {
      return { editorRef: nextProps.editorRef }
    } else return null
  }

  static propTypes = {
    toolbarId: PropTypes.PropTypes.string.isRequired,
    editorRef: PropTypes.object,
    onChangeCallback: PropTypes.func.isRequired
  }

  static defaultProps = {}

  shouldComponentUpdate(nextProps, nextState) {
    const editorRefChanged = !deepEquals(
      nextProps.editorRef,
      nextState.editorRef
    )
    return editorRefChanged
  }

  undo = editorRef => editorRef.current.editor.history.undo()
  redo = editorRef => editorRef.current.editor.history.redo()
  // clear = editorRef => editorRef.current.editor.history.clear()

  render() {
    const { toolbarId, editorRef, onChangeCallback } = this.state
    return (
      <div id={toolbarId}>
        <Group>
          <Align />
          <Fonts />
          <Headers />
          <Sizes />
          <Colors />
          <Backgrounds />
        </Group>

        <QuillButtons />

        <Group>
          <button className="ql-undo" onClick={() => this.undo(editorRef)}>
            <i className="fas fa-undo-alt" />
          </button>
          <button className="ql-undo" onClick={() => this.redo(editorRef)}>
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
}

export default Toolbar
