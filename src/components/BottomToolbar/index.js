import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { Container, Row, Col, Button } from "reactstrap"
import "./styles.css"

const mapStateToProps = ({ Entries: { EntryTags } }) => ({ EntryTags })

const mapDispatchToProps = {}

class BottomToolbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
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
    onChangeCallback: PropTypes.func.isRequired
  }

  static defaultProps = {}

  static getDerivedStateFromProps(nextProps, prevState) {
    const { EntryFiles, latitude, longitude, tags, EntryTags } = nextProps

    return { EntryFiles, latitude, longitude, tags, EntryTags }
  }

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
    const { onChangeCallback } = this.props
    const {
      buttons,
      EntryFiles,
      latitude,
      longitude,
      tags,
      EntryTags
    } = this.state

    console.log(EntryTags, tags)

    return (
      <Container fluid className="BottomToolBar">
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

export default reduxConnect(mapStateToProps, mapDispatchToProps)(BottomToolbar)
