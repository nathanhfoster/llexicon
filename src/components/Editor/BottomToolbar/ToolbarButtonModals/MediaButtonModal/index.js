import React, { useEffect, useState, useCallback, memo } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "store/provider"
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
import memoizeProps from "../../../../../utils/memoizeProps"
import { cleanUrl } from "../../../../Editor/modules/Video"
import { Logo } from "../../../../../images/AWS"
import "./styles.css"

const EMBEDED_TYPES = [
  { id: "image", value: "Image" },
  { id: "video", value: "Video" },
  { id: "video", value: "iFrame" },
]

const PLACEHOLDER = Logo

const mapStateToProps = ({ Window: { innerHeight } }) => ({
  videoHeight: `${innerHeight / 3}px`,
})

const MediaButtonModal = ({ xs, editorRef, editorSelection, videoHeight }) => {
  const [url, setUrl] = useState(PLACEHOLDER)
  const [type, setType] = useState(EMBEDED_TYPES[0].id)
  const [value, setValue] = useState(EMBEDED_TYPES[0].value)

  const handleDropDownClick = useCallback((id, value) => {
    setType(id)
    setValue(value)
  }, [])

  useEffect(() => {
    if (value === "iFrame" && url) {
      const regex = /<iframe.*?s*src="(.*?)".*?<\/iframe>/
      const splitString = regex.exec(url)

      if (splitString && splitString.length > 0) {
        const src = splitString[1]
        setUrl(src)
      }
    }
  }, [url, type])

  const addUrlDisabled = false

  const handleAddUrl = () => {
    let cursorIndex = 0

    if (editorRef.current) {
      if (editorSelection) {
        const { index, length } = editorSelection
        cursorIndex = index
      }
    }

    editorRef.current.getEditor().insertEmbed(cursorIndex, type, url)

    setUrl("")
  }

  const handleInputChange = ({ target: { value } }) => setUrl(value)

  const handleModalCancel = () => setUrl("")

  const handleOnFocus = ({ target }) => target.select()

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
                    value={value}
                    list={EMBEDED_TYPES}
                    onClickCallback={handleDropDownClick}
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
                onFocus={handleOnFocus}
              />
            </InputGroup>
          </Col>
        </Row>
        <div className="Center">
          {type === EMBEDED_TYPES[0].id ? (
            <Media src={url || PLACEHOLDER} className="MediaButtonModalImage" />
          ) : (
            <iframe
              src={cleanUrl(url)}
              frameBorder="0"
              height={videoHeight}
              width="100%"
            />
          )}
        </div>
      </Container>
    </ToolbarModal>
  )
}

MediaButtonModal.propTypes = {
  editorRef: PropTypes.object.isRequired,
  xs: PropTypes.number,
  editorSelection: PropTypes.object,
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
