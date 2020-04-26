import React, { useState, memo } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import {
  Container,
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Media,
} from "reactstrap"
import ToolbarModal from "../../ToolbarModal"
import { BasicDropDown } from "../../../../"
import memoizeProps from "../../../../../helpers/memoizeProps"
import { cleanUrl } from "../../../../Editor/modules/Video"
import "./styles.css"

const EMBEDED_TYPES = [{ id: "Image" }, { id: "Video" }]

const PLACEHOLDER =
  "https://astraltree.s3.us-east-2.amazonaws.com/media/Logo.png"

const mapStateToProps = ({ Window: { innerHeight } }) => ({
  videoHeight: `${innerHeight / 3}px`,
})

const MediaButtonModal = ({ xs, editorRef, editorSelection, videoHeight }) => {
  const [url, setUrl] = useState("")
  const [type, setType] = useState(EMBEDED_TYPES[0].id)

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
                placeholder={PLACEHOLDER}
                value={url}
                onChange={handleInputChange}
              />
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col className="Center">
            {type === EMBEDED_TYPES[0].id ? (
              <Media src={url || PLACEHOLDER} height="100%" width="100%" />
            ) : (
              <iframe
                src={cleanUrl(url)}
                frameBorder="0"
                height={videoHeight}
                width="100%"
              />
            )}
          </Col>
        </Row>
      </Container>
    </ToolbarModal>
  )
}

MediaButtonModal.propTypes = {
  editorRef: PropTypes.object.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  filteredItems: PropTypes.arrayOf(PropTypes.object).isRequired,
  videoHeight: PropTypes.string.isRequired,
}

const isEqual = (prevProps, nextProps) =>
  memoizeProps(prevProps, nextProps, [
    "xs",
    "editorRef",
    "editorSelection",
    "items",
    "filteredItems",
  ])

export default reduxConnect(mapStateToProps)(memo(MediaButtonModal, isEqual))
