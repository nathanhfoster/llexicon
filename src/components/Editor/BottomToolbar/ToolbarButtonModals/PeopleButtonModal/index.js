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
  stringMatch,
} from "../../../../../helpers"
import memoizeProps from "../../../../../helpers/memoizeProps"
import { validateTagOrPeopleString, validatedPersonNameString } from "../utlis"
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

const getInitialState = ({ people }) => ({
  personsName: "",
  people,
})

const PeopleButtonModal = ({
  UserId,
  GetUserEntryPeople,
  items,
  filteredItems,
  EntryPeople,
  entryId,
  xs,
  onChangeCallback,
  ...restOfProps
}) => {
  useEffect(() => {
    if (UserId) GetUserEntryPeople()
  }, [])

  const [{ people, personsName }, setState] = useState(
    getInitialState(restOfProps)
  )

  const resetState = () => setState(getInitialState(restOfProps))

  useEffect(() => {
    setState((prevState) => ({ ...prevState, people: restOfProps.people }))
  }, [restOfProps.people])

  const splitPeopleAsString = personsName.split(",")
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

  const sortedPeople = useMemo(
    () =>
      TopKFrequentStrings(entryPeople, "name")
        .filter((entryPersonName) => {
          if (people.some(({ name }) => name == entryPersonName)) return false
          else if (!lastPeopleAsString) return true
          else if (stringMatch(entryPersonName, lastPeopleAsString)) return true
          else if (stringMatch(entryPersonName, lastPeopleAsString)) return true
          else return false
        })

        .map((name) => ({ name })),
    [entryPeople]
  )

  const handlePeopleInputChange = (e) => {
    const { value } = e.target

    const validatedTagsAsString = validatedPersonNameString(value)

    setState((prevState) => ({
      ...prevState,
      personsName: validatedTagsAsString,
    }))
  }

  const handleSavePeople = () => {
    const payload = {
      id: entryId,
      people,
    }

    onChangeCallback(payload)
    resetState()
  }

  const handleAddPerson = (clickedName) => {
    setState((prevState) => {
      const newPeople = prevState.people.concat({ name: clickedName })
      const removeLastPerson = prevState.personsName.split(",").slice(0, -1)

      const newPersonsName = removeLastPerson
        // .concat(`${clickedName},`)
        .join(",")
      return {
        ...prevState,
        people: newPeople,
        personsName: newPersonsName,
      }
    })
  }

  const handleRemovePerson = (clickedName) => {
    setState((prevState) => {
      const filteredPeople = prevState.people.filter(
        ({ name }) => name != clickedName
      )
      return { ...prevState, people: filteredPeople }
    })
  }

  const handleCreatePeople = () => {
    setState((prevState) => {
      const peopleFromString = validateTagOrPeopleString(splitPeopleAsString)
      const newPeople = removeAttributeDuplicates(
        prevState.people.concat(peopleFromString),
        "name"
      )

      return {
        ...getInitialState(prevState),
        people: newPeople,
      }
    })
  }

  return (
    <ToolbarModal
      title="Add People"
      onSaveCallback={handleSavePeople}
      onCancelCallback={resetState}
      ButtonIcon="fas fa-users"
      button="Add People"
      xs={xs}
    >
      <Container className="PeopleButtonModal Container">
        <Row className="TagAndPeopleContainer">
          <TagsContainer
            tags={sortedPeople}
            maxHeight={150}
            flexWrap="wrap"
            onClickCallback={handleAddPerson}
            hoverable
            emptyString="No people found..."
            faIcon="fas fa-user-plus"
          />
        </Row>
        <Row className="TagAndPeopleContainer mt-2 mb-1">
          <TagsContainer
            tags={people}
            maxHeight={150}
            flexWrap="wrap"
            onClickCallback={handleRemovePerson}
            hoverable
            emptyString="No people added..."
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
                onClick={handleCreatePeople}
              >
                <i className="fas fa-user-plus" style={{ fontSize: 20 }} />
              </InputGroupText>
            </InputGroupAddon>
            <Input
              onChange={handlePeopleInputChange}
              type="text"
              value={personsName}
              placeholder="John Doe,Jane Doe"
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
