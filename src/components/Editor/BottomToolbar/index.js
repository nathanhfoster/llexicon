import React, { Component } from "react"
import PropTypes from "prop-types"
import { Container, Row, Col, Button } from "reactstrap"
import { DEFAULT_STATE_TEXT_EDITOR } from "../../../store/Reducers/TextEditor"
import deepEquals from "../../../helpers/deepEquals"
import "./styles.css"

const { editorStateHtml } = DEFAULT_STATE_TEXT_EDITOR

class BottomToolbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ...props,
      buttons: [
        [
          {
            icon: "fas fa-images",
            title: "Photo",
            onClick: () => console.log("Clicked")
          },
          {
            icon: "fas fa-tags",
            title: "Tags",
            onClick: () => console.log("Clicked")
          },
          {
            icon: "fas fa-star",
            title: "Rating",
            onClick: () => console.log("Clicked")
          }
        ],
        [
          {
            icon: "fas fa-microphone-alt",
            title: "Audio",
            onClick: () => console.log("Clicked")
          },
          {
            icon: "fas fa-file",
            title: "File",
            onClick: () => console.log("Clicked")
          },
          {
            icon: "fas fa-map-marker-alt",
            title: "Location",
            onClick: () => console.log("Clicked")
          }
        ]
      ]
    }
  }

  static propTypes = {
    toolbarId: PropTypes.PropTypes.string.isRequired,
    editorRef: PropTypes.object,
    onChangeCallback: PropTypes.func.isRequired
  }

  static defaultProps = {}

  static getDerivedStateFromProps(nextProps, prevState) {
    const editorRefChanged = !deepEquals(
      nextProps.editorRef,
      prevState.editorRef
    )

    if (editorRefChanged) {
      return { editorRef: nextProps.editorRef }
    } else return null
  }

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

  renderButtonColumns = columns => {
    const { length } = columns
    return columns.map((button, i) => {
      const { icon, title, onClick } = button
      return (
        <Col
          key={i}
          tag={Button}
          className="p-0"
          color="inherit"
          xs={12 / length}
          onClick={onClick}
        >
          <i className={icon} />
          <div>{title}</div>
        </Col>
      )
    })
  }

  renderButtonRows = rows =>
    rows.map((columns, i) => (
      <Row key={i} className="BottomToolButtonRow">
        {this.renderButtonColumns(columns)}
      </Row>
    ))

  render() {
    const { toolbarId, editorRef, onChangeCallback, buttons } = this.state
    return (
      <Container fluid id={toolbarId} className="BottomToolBar">
        <Row className="BottomToolBarTags">
          <Col xs={12} className="p-0 ml-1">
            Tags
          </Col>
        </Row>
        <Row className="BottomToolBarFiles">
          <Col tag={Button} className="p-0" color="inherit" xs={4}>
            BottomToolbar
          </Col>
          <Col tag={Button} className="p-0" color="inherit" xs={4}>
            BottomToolbar
          </Col>
          <Col tag={Button} className="p-0" color="inherit" xs={4}>
            BottomToolbar
          </Col>
        </Row>
        {this.renderButtonRows(buttons)}
      </Container>
    )
  }
}

export default BottomToolbar
