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
    onChangeCallback: PropTypes.func.isRequired
  }

  static defaultProps = {}

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

  handleImageClick = url => {
    const { onChangeCallback } = this.props
    const { html } = this.state
    const newHtml = `${html} <img src=${url} >`
    onChangeCallback({ html: newHtml })
  }

  renderImageFiles = imageFiles => {
    return imageFiles.map((image, i) => {
      const { url, name } = image
      return (
        <Media
          key={i}
          src={url}
          className="EntryFilesCarouselImage"
          alt={name}
          onClick={() => this.handleImageClick(url)}
        />
      )
    })
  }

  render() {
    const { imageFiles } = this.state

    return (
      <Container className="EntryFilesCarousel Container">
        <Row>
          <Col xs={12} className="EntryFilesCarouselImageContainer p-0">
            {this.renderImageFiles(imageFiles)}
          </Col>
        </Row>
      </Container>
    )
  }
}
export default EntryFilesCarousel
