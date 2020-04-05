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
import TagsContainer from "../../../../TagsContainer"
import { GetUserEntryPeople } from "../../../../../redux/Entries/actions"
import {
  TopKFrequentStrings,
  removeAttributeDuplicates,
} from "../../../../../helpers"
import memoizeProps from "../../../../../helpers/memoizeProps"
import { validatedPeopleString } from "../utlis"
import {
  EntriesPropTypes,
  EntryPeopleProps,
} from "../../../../../redux/Entries/propTypes"

const mapStateToProps = ({
  User: { id },
  Entries: { items, filteredItems, EntryPeople },
}) => ({ items, filteredItems, UserId: id, EntryPeople })

const mapDispatchToProps = {
  GetUserEntryPeople,
}

const getInitialState = () => ({
  personsName: "",
  typing: false,
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
  onChangeCallback,
}) => {
  useEffect(() => {
    if (UserId) GetUserEntryPeople()
  }, [])

  const [state, setState] = useState(getInitialState())
  const resetState = () => setState(getInitialState())

  const { personsName, typing } = state

  const splitPeopleAsString = personsName.replace(", ", ",").split(",")
  const lastPeopleAsString = splitPeopleAsString[splitPeopleAsString.length - 1]

  const entryPeople = useMemo(
    () =>
      Object.values(
        items
          .concat(filteredItems)
          .map((entry) => entry.people)
          .flat(1)
          .concat(EntryPeople)
      ),
    [
      items,
      filteredItems,
      EntryPeople,
      personsName,
      people,
      splitPeopleAsString,
    ]
  )

  let sortedPeople = useMemo(
    () =>
      TopKFrequentStrings(entryPeople, "name")
        .filter((entryPersonName) => {
          if (
            splitPeopleAsString.length > 0 &&
            splitPeopleAsString.includes(entryPersonName)
          )
            return false
          else if (people.some(({ name }) => name == entryPersonName))
            return false
          else return true
        })
        .map((name) => ({ name })),
    [entryPeople]
  )

  if (typing && lastPeopleAsString) {
    sortedPeople = sortedPeople.filter((entryPerson) =>
      entryPerson.name.toUpperCase().includes(lastPeopleAsString.toUpperCase())
    )
  }

  const handlePeopleInputChange = (e) => {
    const { value } = e.target

    setState((prevState) => ({
      ...prevState,
      personsName: value,
      typing: true,
    }))
  }

  const handleAddPerson = (name) => {
    const payload = {
      id: entryId,
      people: people.concat({ name }),
    }

    onChangeCallback(payload)

    resetState()
  }

  const handleSavePeople = () => {
    const peopleFromString = validatedPeopleString(splitPeopleAsString)
    const newPeople = removeAttributeDuplicates(
      people.concat(peopleFromString),
      "name"
    )

    const payload = {
      id: entryId,
      people: newPeople,
    }

    onChangeCallback(payload)

    resetState()
  }

  const handleRemovePerson = (clickedName) => {
    const payload = {
      id: entryId,
      people: people.filter(({ name }) => name != clickedName),
    }

    onChangeCallback(payload)
  }

  const handleCancel = () => setState(getInitialState(people))

  return (
    <ToolbarModal
      title="Add People"
      onSaveCallback={handleSavePeople}
      onCancelCallback={handleCancel}
      ButtonIcon="fas fa-users"
      button="Add People"
      xs={xs}
    >
      <Container className="PeopleButtonModal Container">
        <Row className="TagAndPeopleContainer">
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
        <Row className="TagAndPeopleContainer mt-2 mb-1">
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
          <Col className="EntryInput p-1" xs={12} tag={InputGroup}>
            <InputGroupAddon addonType="append">
              <InputGroupText
                tag={Button}
                className="SaveButton"
                color="primary"
                disabled={!personsName}
                onClick={handleAddPerson}
              >
                <i className="fas fa-user-plus" style={{ fontSize: 20 }} />
              </InputGroupText>
            </InputGroupAddon>
            <Input
              onChange={handlePeopleInputChange}
              type="text"
              value={personsName}
              placeholder="John Doe, Jane Doe"
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
  entryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
    "entryId",
    "people",
    "xs",
  ])

export default reduxConnect(
  mapStateToProps,
  mapDispatchToProps
)(memo(PeopleButtonModal, isEqual))
