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
  Button
} from "reactstrap"
import { connect as reduxConnect } from "react-redux"
import ToolbarModal from "../../ToolbarModal"
import EntryFilesCarousel from "../../../../EntryFilesCarousel"
import { BasicDropDown } from "../../../../"
import memoizeProps from "../../../../../helpers/memoizeProps"
import "./styles.css"

const mapStateToProps = ({ Entries: { items, filteredItems } }) => ({
  items,
  filteredItems
})

const mapDispatchToProps = {}

const EMBEDED_TYPES = [{ id: "Image" }, { id: "Video" }]

const MediaButtonModal = ({
  onChangeCallback,
  xs,
  editorRef,
  items,
  filteredItems
}) => {
  const [url, setUrl] = useState("")
  const [type, setType] = useState(EMBEDED_TYPES[0].id)

  const AllEntryFiles = items
    .concat(filteredItems)
    .map(item => item.EntryFiles)
    .flat(1)
    .sort((a, b) => new Date(b.date_updated) - new Date(a.date_updated))

  const addUrlDisabled = false

  const handleAddUrl = () => {
    let cursorIndex = 0
    const lowerCaseType = type.toLowerCase()

    if (editorRef.current) {
      const selection = editorRef.current.getEditorSelection()
      if (selection) {
        const { index, length } = selection
        cursorIndex = index
      }
    }

    editorRef.current.editor.insertEmbed(cursorIndex, lowerCaseType, url)

    setUrl("")
  }

  const handleInputChange = ({ target: { value } }) => setUrl(value)

  return (
    <ToolbarModal
      className="p-0"
      title="Add Media"
      ButtonIcon="fas fa-photo-video"
      buttonTitle="Add Media"
      xs={xs}
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
                <InputGroupText
                  tag={Button}
                  color="primary"
                  style={{ color: "white" }}
                  disabled={addUrlDisabled}
                  // type="submit"
                >
                  <BasicDropDown
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
                placeholder="Embeded"
                value={url}
                onChange={handleInputChange}
              />

              <InputGroupAddon addonType="append" onClick={handleAddUrl}>
                <InputGroupText
                  tag={Button}
                  color="primary"
                  style={{ color: "white" }}
                  disabled={addUrlDisabled}
                  // type="submit"
                >
                  <i className="fas fa-save" style={{ fontSize: 20 }} />
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Col>
        </Row>
        <EntryFilesCarousel
          files={AllEntryFiles}
          onChangeCallback={onChangeCallback}
          editorRef={editorRef}
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
  filteredItems: PropTypes.arrayOf(PropTypes.object).isRequired
}

const isEqual = (prevProps, nextProps) =>
  memoizeProps(
    prevProps,
    nextProps,
    ["html", "onChangeCallback", "xs", "editorRef", "items", "filteredItems"],
    true
  )

export default reduxConnect(
  mapStateToProps,
  mapDispatchToProps
)(memo(MediaButtonModal, isEqual))
