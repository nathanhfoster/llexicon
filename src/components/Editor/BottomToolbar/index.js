import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { Container, Row, Col } from "reactstrap"
import {
  LocationButtonModal,
  TagsButtonModal,
  RatingButtonModal,
  MediaButtonModal
} from "./ToolbarButtonModals"
import TagsContainer from "../../TagsContainer"
import EntryFilesCarousel from "../../EntryFilesCarousel"
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
    id: PropTypes.any,
    editorRef: PropTypes.object,
    html: PropTypes.string.isRequired,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    tags: PropTypes.arrayOf(PropTypes.object),
    rating: PropTypes.number,
    EntryFiles: PropTypes.arrayOf(PropTypes.object),
    EntryTags: PropTypes.arrayOf(PropTypes.object),
    onChangeCallback: PropTypes.func.isRequired
  }

  static defaultProps = {}

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      html,
      latitude,
      longitude,
      tags,
      rating,
      EntryFiles,
      EntryTags,
      onChangeCallback,
      editorRef
    } = nextProps

    const buttons = [
      [
        {
          Component: MediaButtonModal,
          props: { html, onChangeCallback, editorRef }
        },
        { Component: TagsButtonModal, props: { tags, onChangeCallback } },
        {
          Component: RatingButtonModal,
          props: { rating, onChangeCallback }
        }
      ],
      [
        {
          Component: LocationButtonModal,
          props: { latitude, longitude, onChangeCallback }
        }
      ]
    ]

    return {
      html,
      latitude,
      longitude,
      tags,
      rating,
      EntryFiles,
      EntryTags,
      buttons
    }
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
    const { onChangeCallback, editorRef } = this.props
    const {
      buttons,
      html,
      latitude,
      longitude,
      tags,
      rating,
      EntryFiles,
      EntryTags
    } = this.state

    return (
      <Container fluid className="BottomToolBar">
        <Row className="BottomToolBarTags">
          <TagsContainer tags={tags} hoverable={false} />
        </Row>
        <Row className="BottomToolBarFiles">
          <Col xs={12} className="p-1">
            <EntryFilesCarousel
              html={html}
              files={EntryFiles}
              onChangeCallback={onChangeCallback}
              editorRef={editorRef}
            />
          </Col>
        </Row>
        {this.renderButtonRows(buttons)}
      </Container>
    )
  }
}

export default reduxConnect(mapStateToProps, mapDispatchToProps)(BottomToolbar)
