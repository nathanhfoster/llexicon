import React, { useState, useEffect, useCallback, useMemo, useReducer } from 'react'
import PropTypes from 'prop-types'
import {
  Container,
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Button,
} from 'reactstrap'
import { connect } from 'react-redux'
import ToolbarModal from '../../ToolbarModal'
import { TagsContainer, DebounceInput } from '../../../../'
import { GetUserEntryTags } from 'redux/Entries/actions'
import { filterMapArray, TopKFrequentStrings, removeAttributeDuplicates, stringMatch } from 'utils'
import { validateTagOrPeopleString, validatedTagString } from '../utlis'
import { EntriesPropTypes, EntryTagsProps } from 'redux/Entries/propTypes'
import { SUGGESTED } from './utils'

const mapStateToProps = ({ User: { id }, Entries: { items, filteredItems, EntryTags } }) => ({
  entries: filteredItems.length > 0 ? items.concat(filteredItems) : items,
  UserId: id,
  EntryTags,
})

const mapDispatchToProps = {
  GetUserEntryTags,
}

const getInitialState = ({ tags }) => ({
  tagName: '',
  tags,
})

const TagsButtonModal = ({
  UserId,
  GetUserEntryTags,
  entries,
  EntryTags,
  entryId,
  html,
  title,
  xs,
  onChange,
  ...restOfProps
}) => {
  useEffect(() => {
    if (UserId) GetUserEntryTags()
  }, [])

  const [show, toggleShow] = useReducer(prevState => !prevState, false)


  const [{ tags, tagName }, setState] = useState(getInitialState(restOfProps))
  console.log(tags)

  const resetState = useCallback(() => setState(getInitialState(restOfProps)), [restOfProps])

  useEffect(() => {
    setState(prevState => ({ ...prevState, tags: restOfProps.tags }))
  }, [restOfProps.tags])

  const splitTagsAsString = tagName.split(',')
  const lastTagAsString = splitTagsAsString[splitTagsAsString.length - 1]

  const entryTags = useMemo(
    () =>
      show
        ? Object.values(
            entries
              .map(entry => entry.tags)
              .flat(1)
              .concat(EntryTags),
          )
        : [],
    [EntryTags, entries, show],
  )

  const [suggestedTags, frequentTags] = useMemo(() => {
    if (!show) return [[], []]
    else {
      const h = html.toLowerCase()
      const t = title.toLowerCase()
      const f = TopKFrequentStrings(entryTags, 'name')
        .filter(entryPersonName => {
          if (tags.some(({ name }) => name == entryPersonName)) return false
          else if (!lastTagAsString) return true
          else if (stringMatch(entryPersonName, lastTagAsString)) return true
          else return false
        })
        .map(name => ({ name }))

      let suggestedTags = []
      let frequentTags = []

      for (const [key, conditions] of Object.entries(SUGGESTED)) {
        const notInFrequentTags = !frequentTags.some(({ name }) => name === key)
        const notInTags = !tags.some(({ name }) => name === key)
        const conditionMet =
          conditions.length === 0
            ? true
            : conditions.reduce(
                (htmlContainsCondition, condition) =>
                  h.includes(condition) || t.includes(condition) ? true : htmlContainsCondition,
                false,
              )
        if (notInFrequentTags && notInTags && conditionMet) {
          suggestedTags.push({ name: key })
        }
      }

      for (let i = 0, { length } = f; i < length; i++) {
        const tag = f[i]
        const names = tag.name.split(' ')
        if (
          names.some(name => {
            const n = name.toLowerCase()
            return (n && h.includes(n)) || (t && t.includes(n))
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
  }, [show, html, title, entryTags, tags, lastTagAsString])

  const handleTagsInputChange = useCallback(value => {
    const validatedTagsAsString = validatedTagString(value)

    setState(prevState => ({
      ...prevState,
      tagName: validatedTagsAsString,
    }))
  }, [])

  const handleSaveTags = useCallback(() => {
    const payload = {
      id: entryId,
      tags,
    }

    onChange(payload)
    resetState()
  }, [entryId, tags, resetState])

  const handleAddTag = useCallback(clickedName => {
    setState(prevState => {
      const newTags = prevState.tags.concat({ name: clickedName })
      const removeLastTag = prevState.tagName.split(',').slice(0, -1)

      const newTagName = removeLastTag.join(',')

      return {
        ...prevState,
        tags: newTags,
        tagName: newTagName,
      }
    })
  }, [])

  const handleRemoveTag = useCallback(clickedName => {
    setState(prevState => {
      const filteredTags = prevState.tags.filter(({ name }) => name != clickedName)
      return { ...prevState, tags: filteredTags }
    })
  }, [])

  const handleCreateTag = useCallback(() => {
    setState(prevState => {
      const tagsFromString = validateTagOrPeopleString(splitTagsAsString)
      const newTags = removeAttributeDuplicates(prevState.tags.concat(tagsFromString), 'name')

      return {
        ...getInitialState(prevState),
        tags: newTags,
      }
    })
  }, [splitTagsAsString])

  const placeholder = useMemo(() => {
    const tags = suggestedTags.concat(frequentTags)
    if (!show || tags.length === 0) {
      return 'Document,Dream,Family,Friends,Quote,Vacation'
    }

    return tags
      .slice(0, 6)
      .map(({ name }) => name)
      .join(',')
  }, [show, suggestedTags, frequentTags])

  return (
    <ToolbarModal
      show={show}
      toggle={toggleShow}
      title='Add Tags'
      onSaveCallback={handleSaveTags}
      onCancelCallback={resetState}
      ButtonIcon='fas fa-tags'
      button='Add Tags'
      xs={xs}
    >
      {show && (
        <Container className='TagsButtonModal Container'>
          {suggestedTags.length > 0 && (
            <Row className='TagAndPeopleContainer'>
              <h4>Suggested</h4>
              <TagsContainer
                tags={suggestedTags}
                maxHeight={150}
                flexWrap='wrap'
                onClick={handleAddTag}
                hoverable
                emptyString='No tags found...'
                faIcon='fas fa-tag add-plus'
              />
            </Row>
          )}
          <Row className='TagAndPeopleContainer mt-2 mb-1'>
            <h4>Frequent</h4>
            <TagsContainer
              tags={frequentTags}
              maxHeight={150}
              flexWrap='wrap'
              onClick={handleAddTag}
              hoverable
              emptyString='No tags found...'
              faIcon='fas fa-tag add-plus'
            />
          </Row>
          <Row className='TagAndPeopleContainer mt-2 mb-1'>
            <h4>Attached</h4>
            <TagsContainer
              tags={tags}
              maxHeight={150}
              flexWrap='wrap'
              onClick={handleRemoveTag}
              hoverable
              emptyString='No tags added...'
              faIcon='fas fa-tag add-minus'
            />
          </Row>
          <Row>
            <Col className='EntryInput p-1' xs={12} tag={InputGroup}>
              <InputGroupAddon addonType='append'>
                <InputGroupText
                  tag={Button}
                  color='primary'
                  disabled={!tagName}
                  onClick={handleCreateTag}
                >
                  <i className='fas fa-tag add-plus' style={{ fontSize: 20 }} />
                </InputGroupText>
              </InputGroupAddon>
              <DebounceInput
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
  entries: EntriesPropTypes,
  EntryTags: EntryTagsProps.isRequired,
  entryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  tags: EntryTagsProps.isRequired,
  GetUserEntryTags: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
}

TagsButtonModal.defaultProps = {
  tags: [],
}

export default connect(mapStateToProps, mapDispatchToProps)(TagsButtonModal)
