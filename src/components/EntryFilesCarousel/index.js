import React, { memo } from "react"
import PropTypes from "prop-types"
import { Container, Row, Col, Media } from "reactstrap"
import { EntryFilesProps } from "../../redux/Entries/propTypes"
import "./styles.css"

const EntryFilesCarousel = ({
  className,
  files,
  editorRef,
  editorSelection,
  overflowX,
  overflowY,
  whiteSpace,
  onChangeCallback,
}) => {
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
        url,
      } = file
      // console.log(file_type)
      if (file_type.includes("image")) {
        imageFiles.push(file)
      }
    }
  }

  const handleImageClick = (url, file_type) => {
    let cursorIndex = 0

    if (editorRef.current) {
      if (editorSelection) {
        const { index, length } = editorSelection
        cursorIndex = index
      }
    }

    const type = file_type.split("/")[0]

    editorRef.current.editor.insertEmbed(cursorIndex, type, url)
  }

  const renderImageFiles = (imageFiles) => {
    return imageFiles.map((image, i) => {
      const { url, name, file_type } = image
      return (
        <Media
          key={i}
          src={url}
          className="EntryFilesCarouselImage p-1"
          alt={name}
          onClick={() => handleImageClick(url, file_type)}
        />
      )
    })
  }

  return (
    <Container className={className}>
      <Row>
        <Col
          xs={12}
          className="EntryFilesCarouselImageContainer p-0"
          style={{ overflowX, overflowY, whiteSpace }}
        >
          {renderImageFiles(imageFiles)}
        </Col>
      </Row>
    </Container>
  )
}

EntryFilesCarousel.propTypes = {
  files: EntryFilesProps.isRequired,
  onChangeCallback: PropTypes.func.isRequired,
  editorRef: PropTypes.object.isRequired,
}

EntryFilesCarousel.defaultProps = {
  className: "EntryFilesCarousel",
  overflowX: "auto",
  overflowY: "hidden",
  whiteSpace: "nowrap",
}

export default memo(EntryFilesCarousel)
