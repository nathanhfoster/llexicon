import React, { PureComponent, cloneElement } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { Container, Row, Col, Button } from "reactstrap"
import { TagsButtonModal } from "./ToolbarButtonModals"
import TagsContainer from "../../TagsContainer"
import "./styles.css"

const mapStateToProps = ({}) => ({})

const mapDispatchToProps = {}

class BottomToolbar extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      // buttons: [
      //   [
      //     {
      //       icon: "fas fa-images",
      //       title: "Photo",
      //       onClick: () => console.log("Clicked")
      //     },
      //     {
      //       icon: "fas fa-tags",
      //       title: "Tags",
      //       onClick: () => console.log("Clicked")
      //     },
      //     {
      //       icon: "fas fa-star",
      //       title: "Rating",
      //       onClick: () => console.log("Clicked")
      //     }
      //   ],
      //   [
      //     {
      //       icon: "fas fa-microphone-alt",
      //       title: "Audio",
      //       onClick: () => console.log("Clicked")
      //     },
      //     {
      //       icon: "fas fa-file",
      //       title: "File",
      //       onClick: () => console.log("Clicked")
      //     },
      //     {
      //       icon: "fas fa-map-marker-alt",
      //       title: "Location",
      //       onClick: () => console.log("Clicked")
      //     }
      //   ]
      // ]
    }
  }

  static propTypes = {
    onChangeCallback: PropTypes.func.isRequired
  }

  static defaultProps = {}

  static getDerivedStateFromProps(nextProps, prevState) {
    const { latitude, longitude, tags, EntryTags, onChangeCallback } = nextProps

    const buttons = [
      [{ Component: TagsButtonModal, props: { tags, onChangeCallback } }]
      // [{ Component: TagsButtonModal, props: { tags, onChangeCallback } }]
    ]

    return { latitude, longitude, tags, EntryTags, buttons }
  }

  renderButtonColumns = columns => {
    const { length } = columns
    return columns.map((ButtonModal, i) => {
      const { Component, props } = ButtonModal
      return <Component key={i} xs={12 / length} {...props} />
    })
  }

  renderButtonRows = rows =>
    rows.map((columns, i) => (
      <Row key={i} className="BottomToolButtonRow">
        {this.renderButtonColumns(columns)}
      </Row>
    ))

  render() {
    const { onChangeCallback } = this.props
    const { buttons, latitude, longitude, tags, EntryTags } = this.state

    return (
      <Container fluid className="BottomToolBar">
        <Row className="BottomToolBarTags">
          <TagsContainer tags={tags} hoverable={false} />
        </Row>
        <Row className="BottomToolBarFiles">
          <Col tag={Button} className="p-0" color="inherit" xs={4}>
            File
          </Col>
          <Col tag={Button} className="p-0" color="inherit" xs={4}>
            File
          </Col>
          <Col tag={Button} className="p-0" color="inherit" xs={4}>
            File
          </Col>
        </Row>
        {this.renderButtonRows(buttons)}
      </Container>
    )
  }
}

export default reduxConnect(mapStateToProps, mapDispatchToProps)(BottomToolbar)
