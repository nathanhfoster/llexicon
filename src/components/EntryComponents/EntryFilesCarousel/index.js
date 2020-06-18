import React, { useMemo, useCallback } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { BasicImageCarousel, ConfirmAction } from "../.."

import { Container, Row, Col, Button } from "reactstrap"
import { EntryFilesProps } from "../../../redux/Entries/propTypes"
import { removeAttributeDuplicates } from "../../../utils"
import { DeleteEntryFile } from "../../../redux/Entries/actions"
import "./styles.css"

const mapStateToProps = ({ Entries: { items, filteredItems } }) => ({
  items,
  filteredItems,
})

const mapDispatchToProps = { DeleteEntryFile }

const EntryFilesCarousel = ({
  className,
  files,
  editorRef,
  editorSelection,
  overflowX,
  overflowY,
  whiteSpace,
  items,
  filteredItems,
  DeleteEntryFile,
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

  const AllEntryFiles = useMemo(
    () =>
      items
        .concat(filteredItems)
        .map((item) => item.EntryFiles)
        .flat(1)
        .sort((a, b) => new Date(b.date_updated) - new Date(a.date_updated)),
    [items, filteredItems]
  )

  imageFiles = removeAttributeDuplicates(
    imageFiles.concat(AllEntryFiles),
    "url"
  )

  const handleImageClick = useCallback(({ images, photoIndex, isOpen }) => {
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
  }, [])

  const handleImageDelete = useCallback(({ images, photoIndex, isOpen }) => {
    const { id, entry_id } = images[photoIndex]
    DeleteEntryFile(id, entry_id)
  }, [])

  const toolbarButtons = useMemo(
    () => [
      <Button color="accent" onClick={handleImageClick}>
        Insert Image
      </Button>,
      <Button color="danger" onClick={handleImageDelete}>
        Delete Image
      </Button>,
    ],
    []
  )

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
  editorRef: PropTypes.object.isRequired,
}

EntryFilesCarousel.defaultProps = {
  className: "EntryFilesCarousel",
  overflowX: "auto",
  overflowY: "hidden",
  whiteSpace: "nowrap",
}

export default reduxConnect(
  mapStateToProps,
  mapDispatchToProps
)(EntryFilesCarousel)
