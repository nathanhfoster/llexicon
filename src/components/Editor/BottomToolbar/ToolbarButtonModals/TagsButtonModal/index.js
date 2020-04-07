import React, { useState, useEffect, useMemo, memo } from "react"
import PropTypes from "prop-types"
import { Container, Row, Col, Input } from "reactstrap"
import { connect as reduxConnect } from "react-redux"
import ToolbarModal from "../../ToolbarModal"
import TagsContainer from "../../../../TagsContainer"
import { GetUserEntryTags } from "../../../../../redux/Entries/actions"
import { TopKFrequentStrings } from "../../../../../helpers"
import { validatedTagString, validateTagOrPeopleString } from "../utlis"
import memoizeProps from "../../../../../helpers/memoizeProps"
import {
  EntriesPropTypes,
  EntryTagsProps,
} from "../../../../../redux/Entries/propTypes"

const mapStateToProps = ({
  User: { id },
  Entries: { items, filteredItems, EntryTags },
}) => ({ items, filteredItems, UserId: id, EntryTags })

const mapDispatchToProps = { GetUserEntryTags }

const getInitialState = (tags) => ({
  tagsAsString: tags
    .map((tag) => tag.name)
    .join(",")
    .concat(","),
  typing: false,
})

const TagsButtonModal = ({
  UserId,
  GetUserEntryTags,
  items,
  filteredItems,
  EntryTags,
  tags,
  xs,
  onChangeCallback,
}) => {
  useEffect(() => {
    if (UserId) GetUserEntryTags()
  }, [])

  const [{ tagsAsString, typing }, setState] = useState(getInitialState(tags))

  const splitTagsAsString = tagsAsString.split(",")
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
    [items, filteredItems, EntryTags, splitTagsAsString]
  )

  const sortedTags = useMemo(
    () =>
      TopKFrequentStrings(entryTags, "name")
        .filter((name) => {
          if (!lastTagAsString) return true
          else if (name.toUpperCase() == lastTagAsString.toUpperCase())
            return true
          else if (name.toUpperCase().includes(lastTagAsString.toUpperCase()))
            return true
          else return false
        })
        .map((name) => ({ name })),
    [entryTags]
  )

  const handleTagAdd = (name) => {
    setState((prevState) => {
      let nextState = {}
      if (!tagsAsString) {
        nextState = {
          tagsAsString: validatedTagString(tagsAsString.concat(`${name},`)),
          typing: false,
        }
      } else if (typing) {
        let splitTagsAsStrings = tagsAsString.split(",")
        splitTagsAsStrings[splitTagsAsStrings.length - 1] = `${name},`
        nextState = {
          tagsAsString: validatedTagString(splitTagsAsStrings.join(",")),
          typing: false,
        }
      } else {
        nextState = {
          tagsAsString: validatedTagString(tagsAsString.concat(`,${name},`)),
          typing: false,
        }
      }
      return { ...prevState, ...nextState }
    })
  }

  const handleTagsInputChange = (e) => {
    const { value } = e.target

    const validatedTagsAsString = validatedTagString(value)

    setState((prevState) => ({
      ...prevState,
      tagsAsString: validatedTagsAsString,
      typing: true,
    }))
  }

  const handleSave = () => {
    const newTags = validateTagOrPeopleString(tagsAsString.split(","))

    onChangeCallback({ tags: newTags })
  }

  const handleCancel = () => setState(getInitialState(tags))

  return (
    <ToolbarModal
      title="Add Tags"
      onSaveCallback={handleSave}
      onCancelCallback={handleCancel}
      ButtonIcon="fas fa-tags"
      button="Add Tags"
      xs={xs}
    >
      <Container className="TagsButtonModal Container">
        <Row className="TagAndPeopleContainer mb-2">
          <TagsContainer
            tags={sortedTags}
            height={200}
            flexWrap="wrap"
            onClickCallback={handleTagAdd}
            hoverable
            emptyString="No tags found..."
          />
        </Row>
        <Row>
          <Col className="p-1" xs={12}>
            <Input
              onChange={handleTagsInputChange}
              type="text"
              value={tagsAsString}
              placeholder="Family,Friends,Health,Vacation"
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
    "tags",
    "xs",
  ])

export default reduxConnect(
  mapStateToProps,
  mapDispatchToProps
)(memo(TagsButtonModal, isEqual))
