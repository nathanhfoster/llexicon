import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import {
  Container,
  Row,
  Col,
  InputGroup,
  Form,
  InputGroupAddon,
  InputGroupText,
  Input,
  Button
} from "reactstrap"
import { connect as reduxConnect } from "react-redux"
import ToolbarModal from "../../ToolbarModal"
import EntryFilesCarousel from "../../../../EntryFilesCarousel"
import "./styles.css"

const mapStateToProps = ({ Entries: { items } }) => ({
  AllEntryFiles: items
    .reduce(
      (allEntryFiles, entry) => allEntryFiles.concat(entry.EntryFiles),
      []
    )
    .flat(1)
    .sort((a, b) => new Date(b.date_updated) - new Date(a.date_updated))
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

    AllEntryFiles = [
      {
        id: 152,
        entry_id: 2198,
        file_type: "image/png",
        name: "EntryFile-2198.png",
        size: 148845,
        url: "https://astraltree.s3.amazonaws.com/media/EntryFile-2198.png",
        date_created: "2019-12-18 05:40:13",
        date_updated: "2019-12-18 05:40:13",
        date_modified: "2019-12-18 05:40:11"
      },
      {
        id: 151,
        entry_id: 2197,
        file_type: "image/jpeg",
        name: "EntryFile-2197.jpeg",
        size: 203589,
        url:
          "https://astraltree.s3.amazonaws.com/media/EntryFile-2197_imebPJf.jpeg",
        date_created: "2019-12-18 05:37:56",
        date_updated: "2019-12-18 05:37:56",
        date_modified: "2019-12-18 05:37:53"
      },
      {
        id: 150,
        entry_id: 2197,
        file_type: "image/jpeg",
        name: "EntryFile-2197.jpeg",
        size: 110791,
        url: "https://astraltree.s3.amazonaws.com/media/EntryFile-2197.jpeg",
        date_created: "2019-12-18 05:37:03",
        date_updated: "2019-12-18 05:37:03",
        date_modified: "2019-12-18 05:37:01"
      },
      {
        id: 149,
        entry_id: 2195,
        file_type: "image/jpeg",
        name: "EntryFile-2195.jpeg",
        size: 996397,
        url: "https://astraltree.s3.amazonaws.com/media/EntryFile-2195.jpeg",
        date_created: "2019-12-18 01:20:19",
        date_updated: "2019-12-18 01:20:19",
        date_modified: "2019-12-18 01:20:16"
      },
      {
        id: 148,
        entry_id: 2192,
        file_type: "image/jpeg",
        name: "EntryFile-2192.jpeg",
        size: 121169,
        url:
          "https://astraltree.s3.amazonaws.com/media/EntryFile-2192_0f4j4GT.jpeg",
        date_created: "2019-12-17 21:51:10",
        date_updated: "2019-12-17 21:51:10",
        date_modified: "2019-12-17 21:51:09"
      },
      {
        id: 147,
        entry_id: 2192,
        file_type: "image/jpeg",
        name: "EntryFile-2192.jpeg",
        size: 172244,
        url: "https://astraltree.s3.amazonaws.com/media/EntryFile-2192.jpeg",
        date_created: "2019-12-17 21:50:51",
        date_updated: "2019-12-17 21:50:51",
        date_modified: "2019-12-17 21:50:50"
      },
      {
        id: 152,
        entry_id: 2198,
        file_type: "image/png",
        name: "EntryFile-2198.png",
        size: 148845,
        url: "https://astraltree.s3.amazonaws.com/media/EntryFile-2198.png",
        date_created: "2019-12-18 05:40:13",
        date_updated: "2019-12-18 05:40:13",
        date_modified: "2019-12-18 05:40:11"
      },
      {
        id: 151,
        entry_id: 2197,
        file_type: "image/jpeg",
        name: "EntryFile-2197.jpeg",
        size: 203589,
        url:
          "https://astraltree.s3.amazonaws.com/media/EntryFile-2197_imebPJf.jpeg",
        date_created: "2019-12-18 05:37:56",
        date_updated: "2019-12-18 05:37:56",
        date_modified: "2019-12-18 05:37:53"
      },
      {
        id: 150,
        entry_id: 2197,
        file_type: "image/jpeg",
        name: "EntryFile-2197.jpeg",
        size: 110791,
        url: "https://astraltree.s3.amazonaws.com/media/EntryFile-2197.jpeg",
        date_created: "2019-12-18 05:37:03",
        date_updated: "2019-12-18 05:37:03",
        date_modified: "2019-12-18 05:37:01"
      },
      {
        id: 149,
        entry_id: 2195,
        file_type: "image/jpeg",
        name: "EntryFile-2195.jpeg",
        size: 996397,
        url: "https://astraltree.s3.amazonaws.com/media/EntryFile-2195.jpeg",
        date_created: "2019-12-18 01:20:19",
        date_updated: "2019-12-18 01:20:19",
        date_modified: "2019-12-18 01:20:16"
      },
      {
        id: 148,
        entry_id: 2192,
        file_type: "image/jpeg",
        name: "EntryFile-2192.jpeg",
        size: 121169,
        url:
          "https://astraltree.s3.amazonaws.com/media/EntryFile-2192_0f4j4GT.jpeg",
        date_created: "2019-12-17 21:51:10",
        date_updated: "2019-12-17 21:51:10",
        date_modified: "2019-12-17 21:51:09"
      },
      {
        id: 147,
        entry_id: 2192,
        file_type: "image/jpeg",
        name: "EntryFile-2192.jpeg",
        size: 172244,
        url: "https://astraltree.s3.amazonaws.com/media/EntryFile-2192.jpeg",
        date_created: "2019-12-17 21:50:51",
        date_updated: "2019-12-17 21:50:51",
        date_modified: "2019-12-17 21:50:50"
      }
    ]
    return { html, AllEntryFiles, url, addUrlDisabled }
  }

  handleClick = () => {}

  handleCancel = () => {}

  handleSave = () => {
    const { onChangeCallback } = this.props
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
        onClickCallback={this.handleClick}
        onCancelCallback={this.handleCancel}
        onSaveCallback={this.handleSave}
        ButtonIcon="fas fa-photo-video"
        buttonTitle="Add Media"
        xs={xs}
      >
        <Container fluid className="MediaButtonModal p-0">
          <Row>
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
            overFlowX="hidden"
            overFlowY="auto"
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
