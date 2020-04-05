import React, { useState, useEffect, useMemo, memo } from "react"
import PropTypes from "prop-types"
import { Container, Row, Col, Input } from "reactstrap"
import { connect as reduxConnect } from "react-redux"
import ToolbarModal from "../../ToolbarModal"
import TagsContainer from "../../../../TagsContainer"
import { GetUserEntryPeople } from "../../../../../redux/Entries/actions"
import { TopKFrequentStrings } from "../../../../../helpers"
import { validatedString } from "../utlis"
import memoizeProps from "../../../../../helpers/memoizeProps"
import {
  EntriesPropTypes,
  EntryPeopleProps,
} from "../../../../../redux/Entries/propTypes"

const mapStateToProps = ({
  User: { id },
  Entries: { items, filteredItems, EntryPeople },
}) => ({ items, filteredItems, UserId: id, EntryPeople })

const mapDispatchToProps = { GetUserEntryPeople }

const getInitialState = (people) => ({
  peopleAsString: people.map((person) => person.name).join(" "),
  typing: false,
})

const PeopleButtonModal = ({
  UserId,
  GetUserEntryPeople,
  items,
  filteredItems,
  EntryPeople,
  people,
  xs,
  onChangeCallback,
}) => {
  useEffect(() => {
    if (UserId) GetUserEntryPeople()
  }, [])

  const [state, setState] = useState(getInitialState(people))

  const { peopleAsString, typing } = state

  const splitTagsAsString = peopleAsString.split(" ")
  const lastTagAsString = splitTagsAsString[splitTagsAsString.length - 1]

  const entryPeople = useMemo(
    () =>
      Object.values(
        items
          .concat(filteredItems)
          .map((entry) => entry.people)
          .flat(1)
          .concat(EntryPeople)
      ),
    [items, filteredItems, EntryPeople, splitTagsAsString]
  )

  let sortedPeople = useMemo(
    () =>
      TopKFrequentStrings(entryPeople, "name")
        .filter((person) => {
          if (
            splitTagsAsString.length > 0 &&
            splitTagsAsString.includes(person)
          )
            return false
          else return true
        })
        .map((name) => ({ name })),
    [entryPeople]
  )

  if (typing && lastTagAsString) {
    sortedPeople = sortedPeople.filter((entryPerson) =>
      entryPerson.name.toUpperCase().includes(lastTagAsString.toUpperCase())
    )
  }

  const handleTagClick = (name) => {
    let nextState = {}

    if (!state.peopleAsString) {
      nextState = {
        peopleAsString: validatedString(
          state.peopleAsString.concat(`${name} `)
        ),
        typing: false,
      }
    } else if (state.typing) {
      let splitTagsAsStrings = state.peopleAsString.split(" ")
      splitTagsAsStrings[splitTagsAsStrings.length - 1] = `${name} `
      nextState = {
        peopleAsString: validatedString(splitTagsAsStrings.join(" ")),
        typing: false,
      }
    } else {
      nextState = {
        peopleAsString: validatedString(
          state.peopleAsString.concat(` ${name}`)
        ),
        typing: false,
      }
    }

    setState((prevState) => ({ ...prevState, ...nextState }))
  }

  const handleTagsInputChange = (e) => {
    const { value } = e.target

    // Replace commas
    const string = value.replace(",", " ")
    // Remove double spaces and periods
    const validatedTagsAsString = validatedString(string)

    setState((prevState) => ({
      ...prevState,
      peopleAsString: validatedTagsAsString,
      typing: true,
    }))
  }

  const handleSave = () => {
    const newTags = peopleAsString
      .split(" ")
      .filter((string) => string)
      .map((person) => (person = { name: person }))
    onChangeCallback({ people: newTags })
  }

  const handleCancel = () => setState(getInitialState(people))

  return (
    <ToolbarModal
      title="Add People"
      onSaveCallback={handleSave}
      onCancelCallback={handleCancel}
      ButtonIcon="fas fa-users"
      buttonTitle="Add People"
      xs={xs}
    >
      <Container className="PeopleButtonModal Container">
        <Row>
          <TagsContainer
            tags={sortedPeople}
            height={200}
            flexWrap="wrap"
            onClickCallback={handleTagClick}
            hoverable
            emptyString="No people..."
          />
        </Row>
        <Row className="my-1">
          <Col className="px-1" xs={12}>
            <Input
              onChange={handleTagsInputChange}
              type="text"
              id="tagTitle"
              name="tagTitle"
              value={peopleAsString}
              placeholder="Family Friends Health Vacation"
            />
          </Col>
        </Row>
      </Container>
    </ToolbarModal>
  )
}

PeopleButtonModal.propTypes = {
  UserId: PropTypes.number,
  items: EntriesPropTypes,
  filteredItems: EntriesPropTypes,
  EntryPeople: EntryPeopleProps.isRequired,
  people: EntryPeopleProps.isRequired,
  GetUserEntryPeople: PropTypes.func.isRequired,
  onChangeCallback: PropTypes.func.isRequired,
}

PeopleButtonModal.defaultProps = {
  people: [],
}

const isEqual = (prevProps, nextProps) =>
  memoizeProps(prevProps, nextProps, [
    "UserId",
    "items",
    "filteredItems",
    "EntryPeople",
    "people",
    "xs",
  ])

export default reduxConnect(
  mapStateToProps,
  mapDispatchToProps
)(memo(PeopleButtonModal, isEqual))
