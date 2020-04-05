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
  Button
} from "reactstrap"
import { connect as reduxConnect } from "react-redux"
import ToolbarModal from "../../ToolbarModal"
import TagsContainer from "../../../../TagsContainer"
import { GetUserEntryPeople } from "../../../../../redux/Entries/actions"
import { TopKFrequentStrings } from "../../../../../helpers"
import { validatedString } from "../utlis"
import memoizeProps from "../../../../../helpers/memoizeProps"
import {
  EntriesPropTypes,
  EntryPeopleProps
} from "../../../../../redux/Entries/propTypes"

const mapStateToProps = ({
  User: { id },
  Entries: { items, filteredItems, EntryPeople }
}) => ({ items, filteredItems, UserId: id, EntryPeople })

const mapDispatchToProps = {
  GetUserEntryPeople
}

const getInitialState = () => ({
  personsName: "",
  typing: false
})

const PeopleButtonModal = ({
  UserId,
  GetUserEntryPeople,

  items,
  filteredItems,
  EntryPeople,
  entryId,
  people,
  xs,
  onChangeCallback
}) => {
  useEffect(() => {
    if (UserId) GetUserEntryPeople()
  }, [])

  const [state, setState] = useState(getInitialState())
  const resetState = () => setState(getInitialState())

  const { personsName, typing } = state

  const entryPeople = useMemo(
    () =>
      Object.values(
        items
          .concat(filteredItems)
          .map(entry => entry.people)
          .flat(1)
          .concat(EntryPeople)
      ),
    [items, filteredItems, EntryPeople, personsName, people]
  )

  let sortedPeople = useMemo(
    () =>
      TopKFrequentStrings(entryPeople, "name")
        .filter(entryPersonName => {
          if (personsName.length > 0 && personsName.includes(entryPersonName))
            return false
          else if (people.some(({ name }) => name == entryPersonName))
            return false
          else return true
        })
        .map(name => ({ name })),
    [entryPeople]
  )

  if (typing) {
    sortedPeople = sortedPeople.filter(entryPerson =>
      entryPerson.name.toUpperCase().includes(personsName.toUpperCase())
    )
  }

  const handlePeopleInputChange = e => {
    const { value } = e.target

    // Replace commas
    const string = value.replace(",", " ")
    // Remove double spaces and periods
    const validatedTagsAsString = validatedString(string)

    setState(prevState => ({
      ...prevState,
      personsName: validatedTagsAsString,
      typing: true
    }))
  }

  const handleSave = () => {
    resetState()
  }

  const handleAddPerson = name => {
    const payload = {
      id: entryId,
      people: people.concat({ name })
    }

    onChangeCallback(payload)

    resetState()
  }

  const handleAddPersonName = () => handleAddPerson(personsName)

  const handleRemovePerson = clickedName => {
    const payload = {
      id: entryId,
      people: people.filter(({ name }) => name != clickedName)
    }

    onChangeCallback(payload)

    resetState()
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
            onClickCallback={handleAddPerson}
            hoverable
            emptyString="No people..."
            faIcon="fas fa-user-plus"
          />
        </Row>
        <Row className="mb-2">
          <TagsContainer
            tags={people}
            // height={100}
            flexWrap="wrap"
            onClickCallback={handleRemovePerson}
            hoverable
            emptyString="No people..."
            faIcon="fas fa-user-times"
          />
        </Row>
        <Row>
          <Col className="p-0" xs={12}>
            <InputGroup className="EntryInput">
              <InputGroupAddon addonType="append">
                <InputGroupText
                  tag={Button}
                  className="SaveButton"
                  color="primary"
                  disabled={!personsName}
                  onClick={handleAddPersonName}
                >
                  <i className="fas fa-user-plus" style={{ fontSize: 20 }} />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                onChange={handlePeopleInputChange}
                type="text"
                id="tagTitle"
                name="tagTitle"
                value={personsName}
                placeholder="John Doe, Jane Doe"
              />
            </InputGroup>
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
  entryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  people: EntryPeopleProps.isRequired,
  GetUserEntryPeople: PropTypes.func.isRequired,
  onChangeCallback: PropTypes.func.isRequired
}

PeopleButtonModal.defaultProps = {
  people: []
}

const isEqual = (prevProps, nextProps) =>
  memoizeProps(prevProps, nextProps, [
    "UserId",
    "items",
    "filteredItems",
    "EntryPeople",
    "entryId",
    "people",
    "xs"
  ])

export default reduxConnect(
  mapStateToProps,
  mapDispatchToProps
)(memo(PeopleButtonModal, isEqual))
