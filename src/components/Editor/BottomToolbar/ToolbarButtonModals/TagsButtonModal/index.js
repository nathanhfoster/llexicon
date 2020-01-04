import React, { Component } from "react"
import PropTypes from "prop-types"
import { Container, Row, Col, Input } from "reactstrap"
import { connect as reduxConnect } from "react-redux"
import ToolbarModal from "../../ToolbarModal"
import TagsContainer from "../../../../TagsContainer"
import { GetEntryTags } from "../../../../../actions/Entries"
import { removeArrayDuplicates } from "../../../../../helpers"
import deepEquals from "../../../../../helpers/deepEquals"
import "./styles.css"

const mapStateToProps = ({ Entries: { EntryTags } }) => ({ EntryTags })

const mapDispatchToProps = { GetEntryTags }

class TagsButtonModal extends Component {
  constructor(props) {
    super(props)

    const { tags } = props

    this.state = {
      tagsAsString: tags.map(tag => tag.title).join(" "),
      typing: false
    }
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
    let { EntryTags, tags } = nextProps
    const { tagsAsString, typing } = prevState

    const splitTagsAsString = tagsAsString.split(" ")
    const lastTagAsString = splitTagsAsString[splitTagsAsString.length - 1]

    if (typing && lastTagAsString) {
      EntryTags = EntryTags.filter(entryTag =>
        entryTag.title.toUpperCase().includes(lastTagAsString.toUpperCase())
      )
    }

    return {
      EntryTags,
      tags
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const stateChanged = !deepEquals(this.state, nextState)
    return stateChanged
  }

  componentDidMount() {
    const { GetEntryTags } = this.props
    GetEntryTags()
  }

  renderTags = tags =>
    tags.map(tag => {
      const { title } = tag
      return <Col xs={12}>{title}</Col>
    })

  handleTagClick = title => {
    this.setState(currentState => {
      if (!currentState.tagsAsString) {
        return {
          tagsAsString: this.validatedString(
            currentState.tagsAsString.concat(`${title} `)
          ),
          typing: false
        }
      } else if (currentState.typing) {
        let splitTagsAsStrings = currentState.tagsAsString.split(" ")
        splitTagsAsStrings[splitTagsAsStrings.length - 1] = `${title} `
        return {
          tagsAsString: this.validatedString(splitTagsAsStrings.join(" ")),
          typing: false
        }
      } else {
        return {
          tagsAsString: this.validatedString(
            currentState.tagsAsString.concat(` ${title}`)
          ),
          typing: false
        }
      }
    })
  }

  validatedString = s => {
    const validatedString = s.replace(/[^A-Z0-9]+/gi, " ")
    const filteredString = removeArrayDuplicates(
      validatedString.split(" ")
    ).join(" ")

    return filteredString
  }

  handleTagsInputChange = e => {
    const { value } = e.target
    // Remove double spaces and periods
    const newValue = this.validatedString(value)

    this.setState({ tagsAsString: newValue, typing: true })
  }

  handleSave = () => {
    const { onChangeCallback, EntryTags } = this.props
    const { tagsAsString, tags } = this.state
    const newTags = tagsAsString
      .split(" ")
      .filter(string => string)
      .map(tag => (tag = { title: tag }))

    onChangeCallback({ tags: newTags })
  }

  handleCancel = () => {
    // this.setState({ tagsAsString: "" })
  }

  render() {
    const { xs } = this.props
    const { EntryTags, tagsAsString } = this.state

    return (
      <ToolbarModal
        modalTitle="Add Tags"
        onSaveCallback={this.handleSave}
        onCancelCallback={this.handleCancel}
        ButtonIcon="fas fa-tags"
        buttonTitle="Add Tags"
        xs={xs}
      >
        <Container className="TagsButtonModal Container">
          <Row>
            <TagsContainer
              tags={EntryTags}
              height={200}
              flexWrap="wrap"
              onClickCallback={this.handleTagClick}
              hoverable
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
              placeholder="Family Friends Health Vacation"
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
