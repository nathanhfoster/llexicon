import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { Container, Row, Col, Input } from "reactstrap"
import { connect as reduxConnect } from "react-redux"
import ToolbarModal from "../ToolbarModal"
import TagsContainer from "../../../../TagsContainer"
import { GetEntryTags } from "../../../../../actions/Entries"
import "./styles.css"

const mapStateToProps = ({ Entries: { EntryTags } }) => ({ EntryTags })

const mapDispatchToProps = { GetEntryTags }

class TagsButtonModal extends PureComponent {
  constructor(props) {
    super(props)

    const { tags } = props

    this.state = { tagsAsString: tags.map(tag => tag.title).join(" ") }
  }

  static propTypes = {
    EntryTags: PropTypes.arrayOf(PropTypes.object).isRequired,
    tags: PropTypes.arrayOf(PropTypes.object).isRequired,
    GetEntryTags: PropTypes.func.isRequired,
    onChangeCallback: PropTypes.func.isRequired
  }

  static defaultProps = {
    tags: []
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { EntryTags, tags } = nextProps
    const { tagsAsString } = prevState

    return {
      EntryTags: EntryTags.filter(
        entryTag => !tagsAsString.includes(entryTag.title)
      ),
      tags,
      tagsAsString
    }
  }

  componentDidMount() {
    const { GetEntryTags } = this.props
    GetEntryTags()
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    return null
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  componentWillUnmount() {}

  renderTags = tags =>
    tags.map(tag => {
      const { title } = tag
      return <Col xs={12}>{title}</Col>
    })

  handleTagClick = title => {
    this.setState(currentState => {
      return {
        tagsAsString: this.validatedString(
          currentState.tagsAsString.concat(` ${title}`)
        )
      }
    })
  }

  validatedString = s => s.replace(/[^A-Z0-9]+/gi, " ")

  handleTagsInputChange = e => {
    const { value } = e.target
    // Remove double spaces and periods
    const newValue = this.validatedString(value)

    this.setState({ tagsAsString: newValue })
  }

  handleTagsSave = () => {
    const { onChangeCallback, EntryTags } = this.props
    const { tagsAsString, tags } = this.state
    const newTags = tagsAsString
      .split(" ")
      .filter(string => string)
      .map(tag => (tag = { title: tag }))

    onChangeCallback({ tags: newTags })
  }

  render() {
    const { xs } = this.props
    const { EntryTags, tagsAsString } = this.state

    return (
      <ToolbarModal
        modalTitle="Add Tags"
        onClickCallback={this.handleTagsSave}
        buttonIcon="fas fa-tags"
        buttonTitle="Tags"
        xs={xs}
      >
        <Container className="TagsButtonModal Container">
          <Row>
            <TagsContainer
              tags={EntryTags}
              flexWrap="wrap"
              onClickCallback={this.handleTagClick}
            />
          </Row>
          <Row className="mt-3">
            <Col
              tag={Input}
              onChange={this.handleTagsInputChange}
              type="text"
              id="tagTitle"
              name="tagTitle"
              value={tagsAsString}
              placeholder="Tag name..."
              xs={12}
            ></Col>
          </Row>
        </Container>
      </ToolbarModal>
    )
  }
}
export default reduxConnect(
  mapStateToProps,
  mapDispatchToProps
)(TagsButtonModal)
