import React, { memo } from "react"
import PropTypes from "prop-types"
import { BasicImageCarousel } from "../"
import { Container, Row, Col, Media, Button } from "reactstrap"
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

  const handleImageClick = ({ images, photoIndex, isOpen }) => {
    const { url, file_type } = images[photoIndex]
    if (editorRef.current) {
      let cursorIndex = 0
      if (editorSelection) {
        const { index, length } = editorSelection
        cursorIndex = index
      }
      const type = file_type.split("/")[0]

      editorRef.current.editor.insertEmbed(cursorIndex, type, url)
    }
  }

  const toolbarButtons = [
    <Button color="accent" onClick={handleImageClick}>
      Insert Image
    </Button>,
  ]

  return (
    <Container className={className}>
      <Row>
        <Col
          xs={12}
          className="EntryFilesCarouselImageContainer p-0"
          style={{ overflowX, overflowY, whiteSpace }}
        >
          {/* {renderImageFiles(imageFiles)} */}
          <BasicImageCarousel
            images={imageFiles}
            toolbarButtons={toolbarButtons}
          />
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
