import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { Container, Row, Col, Media } from "reactstrap"
import "./styles.css"

class EntryFilesCarousel extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {
    html: PropTypes.string.isRequired,
    files: PropTypes.arrayOf(PropTypes.object).isRequired,
    onChangeCallback: PropTypes.func.isRequired,
    editorRef: PropTypes.object.isRequired
  }

  static defaultProps = {
    overflowX: "auto",
    overflowY: "hidden",
    whiteSpace: "nowrap"
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { html, files } = nextProps
    let imageFiles = []

    if (files) {
      for (const file of files) {
        const {
          date_created,
          date_modified,
          date_updated,
          entry_id,
          file_type,
          id,
          name,
          size,
          url
        } = file
        // console.log(file_type)
        if (file_type.includes("image")) {
          imageFiles.push(file)
        }
      }
    }

    return { html, imageFiles }
  }

  handleImageClick = (url, file_type) => {
    const { onChangeCallback, editorRef } = this.props
    let cursorIndex = 0

    if (editorRef.current) {
      const selection = editorRef.current.getEditorSelection()
      if (selection) {
        const { index, length } = selection
        cursorIndex = index
      }
    }

    // editorRef.current.editor.insertText(
    //   cursorIndex,
    //   `<img src=${url} >`,
    //   "bold",
    //   true
    // )

    const type = file_type.split("/")[0]

    editorRef.current.editor.insertEmbed(cursorIndex, type, url)

    // const { html } = this.state

    // const newHtml = `${html} <img src=${url} >`
    // onChangeCallback({ html: newHtml })
  }

  renderImageFiles = imageFiles => {
    return imageFiles.map((image, i) => {
      const { url, name, file_type } = image
      return (
        <Media
          key={i}
          src={url}
          className="EntryFilesCarouselImage"
          alt={name}
          onClick={() => this.handleImageClick(url, file_type)}
        />
      )
    })
  }

  render() {
    const { editorRef, overflowX, overflowY, whiteSpace } = this.props
    const { imageFiles } = this.state

    return (
      <Container className="EntryFilesCarousel Container">
        <Row>
          <Col
            xs={12}
            className="EntryFilesCarouselImageContainer p-0"
            style={{ overflowX, overflowY, whiteSpace }}
          >
            {this.renderImageFiles(imageFiles)}
          </Col>
        </Row>
      </Container>
    )
  }
}
export default EntryFilesCarousel
