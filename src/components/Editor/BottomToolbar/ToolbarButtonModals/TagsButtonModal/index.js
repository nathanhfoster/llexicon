import React, { useState, useEffect, useCallback, useMemo, memo } from "react"
import PropTypes from "prop-types"
import {
  Container,
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Button
} from "reactstrap"
import { connect as reduxConnect } from "react-redux"
import ToolbarModal from "../../ToolbarModal"
import { TagsContainer, DebounceInput } from "../../../../"
import { GetUserEntryTags } from "../../../../../redux/Entries/actions"
import {
  filterMapArray,
  TopKFrequentStrings,
  removeAttributeDuplicates,
  stringMatch
} from "../../../../../utils"
import memoizeProps from "../../../../../utils/memoizeProps"
import { validateTagOrPeopleString, validatedTagString } from "../utlis"
import {
  EntriesPropTypes,
  EntryTagsProps
} from "../../../../../redux/Entries/propTypes"

const mapStateToProps = ({
  User: { id },
  Entries: { items, filteredItems, EntryTags }
}) => ({ items, filteredItems, UserId: id, EntryTags })

const mapDispatchToProps = {
  GetUserEntryTags
}

const getInitialState = ({ tags }) => ({
  tagName: "",
  tags
})

const TagsButtonModal = ({
  UserId,
  GetUserEntryTags,
  items,
  filteredItems,
  EntryTags,
  entryId,
  html,
  xs,
  onChangeCallback,
  ...restOfProps
}) => {
  useEffect(() => {
    if (UserId) GetUserEntryTags()
  }, [])

  const [show, setShow] = useState(false)
  const handleToogle = useCallback(() => setShow((prevShow) => !prevShow))

  const [{ tags, tagName }, setState] = useState(getInitialState(restOfProps))

  const resetState = () => setState(getInitialState(restOfProps))

  useEffect(() => {
    setState((prevState) => ({ ...prevState, tags: restOfProps.tags }))
  }, [restOfProps.tags])

  const splitTagsAsString = tagName.split(",")
  const lastTagAsString = splitTagsAsString[splitTagsAsString.length - 1]

  let entryTags = useMemo(
    () =>
      show
        ? Object.values(
            items
              .concat(filteredItems)
              .map((entry) => entry.tags)
              .flat(1)
              .concat(EntryTags)
          )
        : [],
    [show, items, filteredItems, EntryTags, tagName, tags, splitTagsAsString]
  )

  const [suggestedTags, frequentTags] = useMemo(() => {
    if (!show) return [[], []]
    else {
      const h = html.toLowerCase()
      const t = TopKFrequentStrings(entryTags, "name")
        .filter((entryPersonName) => {
          if (tags.some(({ name }) => name == entryPersonName)) return false
          else if (!lastTagAsString) return true
          else if (stringMatch(entryPersonName, lastTagAsString)) return true
          else return false
        })
        .map((name) => ({ name }))

      let suggestedTags = []
      let frequentTags = []

      const suggested = {
        Amazon: ["amazon"],
        Apple: ["apple"],
        Article: [
          "quora",
          "article",
          "medium",
          "forbes",
          "fox",
          "cnn",
          "nytimes",
          "express",
          "politic",
          "cbs",
          "theverge",
          "yahoo",
          "fortune",
          "post",
          "file"
        ],
        Cloud: ["doc", "drive", "aws", "dropbox", "cloud", "box", "file"],
        Development: [
          "app",
          "css",
          "react",
          "angular",
          "ionic",
          "vue",
          "material",
          "pwa"
        ],
        Document: ["doc", "drive", "aws", "dropbox", "cloud", "box", "file"],
        Dream: ["dream", "vision"],
        Facebook: ["facebook"],
        Gaming: ["game", "theverge"],
        Email: ["mail", "message"],
        Image: ["<img src", "instagram", "pintrest", "image", "photo", "file"],
        Instagram: ["instagram"],
        Twitter: ["twitter"],
        Link: ["http", ".com"],
        Review: ["yelp", "review"],
        Shopping: ["amazon", "bestbuy", "lowes", "shop", "target"],
        Support: ["support"],
        Text: ["text", "message"],
        Video: ["youtube", "<iframe", "file"],
        Vision: ["dream", "vision"]
      }

      for (const [key, conditions] of Object.entries(suggested)) {
        const notInFrequentTags = !frequentTags.some(({ name }) => name === key)
        const notInTags = !tags.some(({ name }) => name === key)
        const conditionMet =
          conditions.length === 0
            ? true
            : conditions.reduce(
                (htmlContainsCondition, condition) =>
                  h.includes(condition) ? true : htmlContainsCondition,
                false
              )
        if (notInFrequentTags && notInTags && conditionMet) {
          suggestedTags.push({ name: key })
        }
      }

      for (let i = 0, { length } = t; i < length; i++) {
        const tag = t[i]
        const names = tag.name.split(" ")
        if (
          names.some((name) => {
            const n = name.toLowerCase()
            return n && h.includes(n)
          })
        ) {
          if (!suggestedTags.some(({ name }) => name === tag.name)) {
            suggestedTags.push(tag)
          }
        } else if (!frequentTags.some(({ name }) => name === tag.name)) {
          frequentTags.push(tag)
        }
      }

      return [suggestedTags, frequentTags]
    }
  }, [show, html, entryTags, tags])

  const handleTagsInputChange = (value) => {
    const validatedTagsAsString = validatedTagString(value)

    setState((prevState) => ({
      ...prevState,
      tagName: validatedTagsAsString
    }))
  }

  const handleSaveTags = () => {
    const payload = {
      id: entryId,
      tags
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
        tagName: newTagName
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
        tags: newTags
      }
    })
  }

  const placeholder = useMemo(() => {
    const tags = suggestedTags.concat(frequentTags)
    if (!show || tags.length === 0) {
      return "Document,Dream,Family,Friends,Quote,Vacation"
    }

    return tags
      .slice(0, 6)
      .map(({ name }) => name)
      .join(",")
  }, [suggestedTags, frequentTags])

  return (
    <ToolbarModal
      show={show}
      toggle={handleToogle}
      title="Add Tags"
      onSaveCallback={handleSaveTags}
      onCancelCallback={resetState}
      ButtonIcon="fas fa-tags"
      button="Add Tags"
      xs={xs}
    >
      {show && (
        <Container className="TagsButtonModal Container">
          {suggestedTags.length > 0 && (
            <Row className="TagAndPeopleContainer">
              <h4>Suggested</h4>
              <TagsContainer
                tags={suggestedTags}
                maxHeight={150}
                flexWrap="wrap"
                onClickCallback={handleAddTag}
                hoverable
                emptyString="No tags found..."
                faIcon="fas fa-tag add-plus"
              />
            </Row>
          )}
          <Row className="TagAndPeopleContainer mt-2 mb-1">
            <h4>Frequent</h4>
            <TagsContainer
              tags={frequentTags}
              maxHeight={150}
              flexWrap="wrap"
              onClickCallback={handleAddTag}
              hoverable
              emptyString="No tags found..."
              faIcon="fas fa-tag add-plus"
            />
          </Row>
          <Row className="TagAndPeopleContainer mt-2 mb-1">
            <h4>Attached</h4>
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
              <DebounceInput
                type="text"
                value={tagName}
                onChange={handleTagsInputChange}
                placeholder={placeholder}
                focusOnMount
              />
            </Col>
          </Row>
        </Container>
      )}
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
    "entryId",
    "tags",
    "xs",
    "html"
  ])

export default reduxConnect(
  mapStateToProps,
  mapDispatchToProps
)(memo(TagsButtonModal, isEqual))
