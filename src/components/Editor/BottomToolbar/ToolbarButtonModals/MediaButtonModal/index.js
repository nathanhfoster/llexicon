import React, { useState, memo } from "react"
import PropTypes from "prop-types"
import {
  Container,
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
} from "reactstrap"
import { connect as reduxConnect } from "react-redux"
import ToolbarModal from "../../ToolbarModal"
import EntryFilesCarousel from "../../../../EntryFilesCarousel"
import { BasicDropDown } from "../../../../"
import memoizeProps from "../../../../../helpers/memoizeProps"
import "./styles.css"

const mapStateToProps = ({ Entries: { items, filteredItems } }) => ({
  items,
  filteredItems,
})

const mapDispatchToProps = {}

const EMBEDED_TYPES = [{ id: "Image" }, { id: "Video" }]

const MediaButtonModal = ({
  onChangeCallback,
  xs,
  editorRef,
  editorSelection,
  items,
  filteredItems,
}) => {
  const [url, setUrl] = useState("")
  const [type, setType] = useState(EMBEDED_TYPES[0].id)

  const AllEntryFiles = items
    .concat(filteredItems)
    .map((item) => item.EntryFiles)
    .flat(1)
    .sort((a, b) => new Date(b.date_updated) - new Date(a.date_updated))

  const addUrlDisabled = false

  const handleAddUrl = () => {
    let cursorIndex = 0
    const lowerCaseType = type.toLowerCase()

    if (editorRef.current) {
      if (editorSelection) {
        const { index, length } = editorSelection
        cursorIndex = index
      }
    }

    editorRef.current.getEditor().insertEmbed(cursorIndex, lowerCaseType, url)

    setUrl("")
  }

  const handleInputChange = ({ target: { value } }) => setUrl(value)
  const handleModalCancel = () => setUrl("")

  return (
    <ToolbarModal
      className="p-0"
      title="Add Media"
      ButtonIcon="fas fa-photo-video"
      button="Add Media"
      xs={xs}
      onSaveCallback={handleAddUrl}
      onCancelCallback={handleModalCancel}
      disabledSave={addUrlDisabled}
    >
      <Container fluid className="MediaButtonModal p-0">
        <Row className="p-2">
          <Col xs={12}>
            <InputGroup
              // tag={Form}
              className="EntryInput"
              // onSubmit={handleAddUrl}
              // method="post"
            >
              <InputGroupAddon addonType="append">
                <InputGroupText className="p-0">
                  <BasicDropDown
                    className="MediaDropDown"
                    value={type}
                    list={EMBEDED_TYPES}
                    onClickCallback={setType}
                  />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                type="text"
                name="url"
                id="url"
                placeholder="https://astraltree.s3.us-east-2.amazonaws.com/media/Logo.png"
                value={url}
                onChange={handleInputChange}
              />
            </InputGroup>
          </Col>
        </Row>
        <EntryFilesCarousel
          className="MediaEntryFilesCarousel"
          files={AllEntryFiles}
          onChangeCallback={onChangeCallback}
          editorRef={editorRef}
          editorSelection={editorSelection}
          overflowX="hidden"
          overflowY="auto"
          whiteSpace="wrap"
        />
      </Container>
    </ToolbarModal>
  )
}

MediaButtonModal.propTypes = {
  editorRef: PropTypes.object.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  filteredItems: PropTypes.arrayOf(PropTypes.object).isRequired,
}

const isEqual = (prevProps, nextProps) =>
  memoizeProps(prevProps, nextProps, [
    "xs",
    "editorRef",
    "editorSelection",
    "items",
    "filteredItems",
  ])

export default reduxConnect(
  mapStateToProps,
  mapDispatchToProps
)(memo(MediaButtonModal, isEqual))
