import React, { useState, useEffect, memo } from "react"
import PropTypes from "prop-types"
import { Container, Row, Col, Input } from "reactstrap"
import { connect as reduxConnect } from "react-redux"
import ToolbarModal from "../../ToolbarModal"
import TagsContainer from "../../../../TagsContainer"
import { GetUserEntryTags } from "../../../../../redux/Entries/actions"
import {
  removeArrayDuplicates,
  TopKFrequentStrings
} from "../../../../../helpers"
import memoizeProps from "../../../../../helpers/memoizeProps"
import { EntriesPropTypes } from "../../../../../redux/Entries/propTypes"
import "./styles.css"

const mapStateToProps = ({
  User: { id },
  Entries: { items, filteredItems, EntryTags }
}) => ({ items, filteredItems, UserId: id, EntryTags })

const mapDispatchToProps = { GetUserEntryTags }

const validatedString = s => {
  const validatedString = s.replace(/[^A-Z0-9]+/gi, " ")
  const filteredString = removeArrayDuplicates(validatedString.split(" ")).join(
    " "
  )
  return filteredString
}

const getInitialState = tags => ({
  tagsAsString: tags.map(tag => tag.title).join(" "),
  typing: false
})

const TagsButtonModal = ({
  UserId,
  GetUserEntryTags,
  items,
  filteredItems,
  EntryTags,
  tags,
  xs,
  onChangeCallback
}) => {
  const entryTags = Object.values(
    items
      .concat(filteredItems)
      .map(entry => entry.tags)
      .flat(1)
      .concat(EntryTags)
  )

  let sortedTags = TopKFrequentStrings(entryTags, "title").map(title => ({
    title
  }))

  useEffect(() => {
    if (UserId) GetUserEntryTags()
  }, [])

  const [state, setState] = useState(getInitialState(tags))

  const { tagsAsString, typing } = state

  const splitTagsAsString = tagsAsString.split(" ")
  const lastTagAsString = splitTagsAsString[splitTagsAsString.length - 1]

  if (typing && lastTagAsString) {
    sortedTags = sortedTags.filter(entryTag =>
      entryTag.title.toUpperCase().includes(lastTagAsString.toUpperCase())
    )
  }

  const handleTagClick = title => {
    let nextState = {}

    if (!state.tagsAsString) {
      nextState = {
        tagsAsString: validatedString(state.tagsAsString.concat(`${title} `)),
        typing: false
      }
    } else if (state.typing) {
      let splitTagsAsStrings = state.tagsAsString.split(" ")
      splitTagsAsStrings[splitTagsAsStrings.length - 1] = `${title} `
      nextState = {
        tagsAsString: validatedString(splitTagsAsStrings.join(" ")),
        typing: false
      }
    } else {
      nextState = {
        tagsAsString: validatedString(state.tagsAsString.concat(` ${title}`)),
        typing: false
      }
    }

    setState(prevState => ({ ...prevState, ...nextState }))
  }

  const handleTagsInputChange = e => {
    const { value } = e.target

    // Replace commas
    const string = value.replace(",", " ")
    // Remove double spaces and periods
    const validatedTagsAsString = validatedString(string)

    setState(prevState => ({
      ...prevState,
      tagsAsString: validatedTagsAsString,
      typing: true
    }))
  }

  const handleSave = () => {
    const newTags = tagsAsString
      .split(" ")
      .filter(string => string)
      .map(tag => (tag = { title: tag }))
    onChangeCallback({ tags: newTags })
  }

  const handleCancel = () => setState(getInitialState(tags))

  return (
    <ToolbarModal
      title="Add Tags"
      onSaveCallback={handleSave}
      onCancelCallback={handleCancel}
      ButtonIcon="fas fa-tags"
      buttonTitle="Add Tags"
      xs={xs}
    >
      <Container className="TagsButtonModal Container">
        <Row>
          <TagsContainer
            tags={sortedTags}
            height={200}
            flexWrap="wrap"
            onClickCallback={handleTagClick}
            hoverable
          />
        </Row>
        <Row className="my-1">
          <Col className="px-1" xs={12}>
            <Input
              onChange={handleTagsInputChange}
              type="text"
              id="tagTitle"
              name="tagTitle"
              value={tagsAsString}
              placeholder="Family Friends Health Vacation"
            />
          </Col>
        </Row>
      </Container>
    </ToolbarModal>
  )
}

TagsButtonModal.propTypes = {
  UserId: PropTypes.number,
  items: EntriesPropTypes,
  filteredItems: EntriesPropTypes,
  EntryTags: PropTypes.arrayOf(PropTypes.object).isRequired,
  tags: PropTypes.arrayOf(PropTypes.object).isRequired,
  GetUserEntryTags: PropTypes.func.isRequired,
  onChangeCallback: PropTypes.func.isRequired
}

TagsButtonModal.defaultProps = {
  tags: []
}

const isEqual = (prevProps, nextProps) =>
  memoizeProps(prevProps, nextProps, [
    "UserId",
    "items",
    "filteredItems",
    "EntryTags",
    "tags",
    "xs"
  ])

export default reduxConnect(
  mapStateToProps,
  mapDispatchToProps
)(memo(TagsButtonModal, isEqual))
