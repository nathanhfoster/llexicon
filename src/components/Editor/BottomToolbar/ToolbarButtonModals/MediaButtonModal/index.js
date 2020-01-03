import React, { PureComponent } from "react"
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
import { filterMapArray } from "../../../../../helpers"
import "./styles.css"

const mapStateToProps = ({ Entries: { items, filteredItems } }) => ({
  AllEntryFiles: filterMapArray(
    items
      .concat(filteredItems)
      .map(item => item.EntryFiles)
      .flat(1)
  ).sort((a, b) => new Date(b.date_updated) - new Date(a.date_updated))
})

const mapDispatchToProps = {}

class MediaButtonModal extends PureComponent {
  constructor(props) {
    super(props)

    this.state = { url: "" }
  }

  static propTypes = {}

  static defaultProps = { editorRef: PropTypes.object.isRequired }

  static getDerivedStateFromProps(nextProps, prevState) {
    let { html, AllEntryFiles } = nextProps
    const { url } = prevState

    const addUrlDisabled = false

    return { html, AllEntryFiles, url, addUrlDisabled }
  }

  findFileType = url => {
    if (url.includes("youtube")) return "video"
    return "image"
  }

  handleAddUrl = () => {
    const { editorRef } = this.props
    let { url } = this.state
    let cursorIndex = 0

    if (editorRef.current) {
      const selection = editorRef.current.getEditorSelection()
      if (selection) {
        const { index, length } = selection
        cursorIndex = index
      }
    }

    const type = this.findFileType(url)

    editorRef.current.editor.insertEmbed(cursorIndex, type, url)

    this.setState({ url: "" })
  }

  handleInputChange = e => this.setState({ url: e.target.value })

  render() {
    const { onChangeCallback, xs, editorRef } = this.props
    const { html, AllEntryFiles, url, addUrlDisabled } = this.state

    return (
      <ToolbarModal
        className="p-0"
        modalTitle="Add Media"
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
                // onSubmit={this.handleAddUrl}
                // method="post"
              >
                <Input
                  type="text"
                  name="url"
                  id="url"
                  placeholder="Embeded"
                  value={url}
                  onChange={this.handleInputChange}
                />
                <InputGroupAddon addonType="append" onClick={this.handleAddUrl}>
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
            html={html}
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
}
export default reduxConnect(
  mapStateToProps,
  mapDispatchToProps
)(MediaButtonModal)
