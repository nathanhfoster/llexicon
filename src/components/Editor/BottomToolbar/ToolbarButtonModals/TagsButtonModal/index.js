import React, { useState, useEffect, useMemo, memo } from "react"
import PropTypes from "prop-types"
import {
  Container,
  Row,
  Col,
  InputGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  Button,
} from "reactstrap"
import { connect as reduxConnect } from "react-redux"
import ToolbarModal from "../../ToolbarModal"
import { TagsContainer } from "../../../../"
import { GetUserEntryTags } from "../../../../../redux/Entries/actions"
import {
  TopKFrequentStrings,
  removeAttributeDuplicates,
  stringMatch,
} from "../../../../../utils"
import memoizeProps from "../../../../../utils/memoizeProps"
import { validateTagOrPeopleString, validatedTagString } from "../utlis"
import {
  EntriesPropTypes,
  EntryTagsProps,
} from "../../../../../redux/Entries/propTypes"

const mapStateToProps = ({
  User: { id },
  Entries: { items, filteredItems, EntryTags },
}) => ({ items, filteredItems, UserId: id, EntryTags })

const mapDispatchToProps = {
  GetUserEntryTags,
}

const getInitialState = ({ tags }) => ({
  tagName: "",
  tags,
})

const TagsButtonModal = ({
  UserId,
  GetUserEntryTags,
  items,
  filteredItems,
  EntryTags,
  entryId,
  xs,
  onChangeCallback,
  ...restOfProps
}) => {
  useEffect(() => {
    if (UserId) GetUserEntryTags()
  }, [])

  const [{ tags, tagName }, setState] = useState(getInitialState(restOfProps))

  const resetState = () => setState(getInitialState(restOfProps))

  useEffect(() => {
    setState((prevState) => ({ ...prevState, tags: restOfProps.tags }))
  }, [restOfProps.tags])

  const splitTagsAsString = tagName.split(",")
  const lastTagAsString = splitTagsAsString[splitTagsAsString.length - 1]

  const entryTags = useMemo(
    () =>
      Object.values(
        items
          .concat(filteredItems)
          .map((entry) => entry.tags)
          .flat(1)
          .concat(EntryTags)
      ),
    [items, filteredItems, EntryTags, tagName, tags, splitTagsAsString]
  )

  const sortedTags = useMemo(
    () =>
      TopKFrequentStrings(entryTags, "name")
        .filter((entryPersonName) => {
          if (tags.some(({ name }) => name == entryPersonName)) return false
          else if (!lastTagAsString) return true
          else if (stringMatch(entryPersonName, lastTagAsString)) return true
          else if (stringMatch(entryPersonName, lastTagAsString)) return true
          else return false
        })

        .map((name) => ({ name })),
    [entryTags]
  )

  const handleTagsInputChange = (e) => {
    const { value } = e.target

    const validatedTagsAsString = validatedTagString(value)

    setState((prevState) => ({
      ...prevState,
      tagName: validatedTagsAsString,
    }))
  }

  const handleSaveTags = () => {
    const payload = {
      id: entryId,
      tags,
    }

    onChangeCallback(payload)
    resetState()
  }

  const handleAddTag = (clickedName) => {
    setState((prevState) => {
      const newTags = prevState.tags.concat({ name: clickedName })
      const removeLastTag = prevState.tagName.split(",").slice(0, -1)

      const newTagName = removeLastTag
        // .concat(`${clickedName},`)
        .join(",")

      return {
        ...prevState,
        tags: newTags,
        tagName: newTagName,
      }
    })
  }

  const handleRemoveTag = (clickedName) => {
    setState((prevState) => {
      const filteredTags = prevState.tags.filter(
        ({ name }) => name != clickedName
      )
      return { ...prevState, tags: filteredTags }
    })
  }

  const handleCreateTag = () => {
    setState((prevState) => {
      const tagsFromString = validateTagOrPeopleString(splitTagsAsString)
      const newTags = removeAttributeDuplicates(
        prevState.tags.concat(tagsFromString),
        "name"
      )

      return {
        ...getInitialState(prevState),
        tags: newTags,
      }
    })
  }

  return (
    <ToolbarModal
      title="Add Tags"
      onSaveCallback={handleSaveTags}
      onCancelCallback={resetState}
      ButtonIcon="fas fa-tags"
      button="Add Tags"
      xs={xs}
    >
      <Container className="TagsButtonModal Container">
        <Row className="TagAndPeopleContainer">
          <TagsContainer
            tags={sortedTags}
            maxHeight={150}
            flexWrap="wrap"
            onClickCallback={handleAddTag}
            hoverable
            emptyString="No tags found..."
            faIcon="fas fa-tag add-plus"
          />
        </Row>
        <Row className="TagAndPeopleContainer mt-2 mb-1">
          <TagsContainer
            tags={tags}
            maxHeight={150}
            flexWrap="wrap"
            onClickCallback={handleRemoveTag}
            hoverable
            emptyString="No tags added..."
            faIcon="fas fa-tag add-minus"
          />
        </Row>
        <Row>
          <Col className="EntryInput p-1" xs={12} tag={InputGroup}>
            <InputGroupAddon addonType="append">
              <InputGroupText
                tag={Button}
                className="SaveButton"
                color="primary"
                disabled={!tagName}
                onClick={handleCreateTag}
              >
                <i className="fas fa-tag add-plus" style={{ fontSize: 20 }} />
              </InputGroupText>
            </InputGroupAddon>
            <Input
              onChange={handleTagsInputChange}
              type="text"
              value={tagName}
              placeholder="Document,Dream,Family,Friends,Quote,Vacation"
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
  EntryTags: EntryTagsProps.isRequired,
  entryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  tags: EntryTagsProps.isRequired,
  GetUserEntryTags: PropTypes.func.isRequired,
  onChangeCallback: PropTypes.func.isRequired,
}

TagsButtonModal.defaultProps = {
  tags: [],
}

const isEqual = (prevProps, nextProps) =>
  memoizeProps(prevProps, nextProps, [
    "UserId",
    "items",
    "filteredItems",
    "EntryTags",
    "entryId",
    "tags",
    "xs",
  ])

export default reduxConnect(
  mapStateToProps,
  mapDispatchToProps
)(memo(TagsButtonModal, isEqual))
