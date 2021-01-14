import React, { useState, useEffect, useCallback, useMemo } from 'react'
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
import { TagsContainer, DebounceInput } from 'components'
import { GetUserEntryPeople } from 'redux/Entries/actions'
import { TopKFrequentStrings, removeAttributeDuplicates, stringMatch } from 'utils'
import { validateTagOrPeopleString, validatedPersonNameString } from '../utlis'
import { EntriesPropTypes, EntryPeopleProps } from 'redux/Entries/propTypes'

const mapStateToProps = ({ User: { id }, Entries: { items, filteredItems, EntryPeople } }) => ({
  entries: filteredItems.length > 0 ? items.concat(filteredItems) : items,
  UserId: id,
  EntryPeople,
})

const mapDispatchToProps = {
  GetUserEntryPeople,
}

const getInitialState = ({ people }) => ({
  personsName: '',
  people,
})

const PeopleButtonModal = ({
  UserId,
  GetUserEntryPeople,
  entries,
  EntryPeople,
  entryId,
  html,
  title,
  xs,
  onChange,
  ...restOfProps
}) => {
  useEffect(() => {
    if (UserId) GetUserEntryPeople()
  }, [])

  const [show, setShow] = useState(false)

  const handleToogle = useCallback(() => setShow(prevShow => !prevShow), [])

  const [{ people, personsName }, setState] = useState(getInitialState(restOfProps))

  const resetState = useCallback(() => setState(getInitialState(restOfProps)), [restOfProps])

  useEffect(() => {
    setState(prevState => ({ ...prevState, people: restOfProps.people }))
  }, [restOfProps.people])

  const splitPeopleAsString = personsName.split(',')
  const lastPeopleAsString = splitPeopleAsString[splitPeopleAsString.length - 1]

  const entryPeople = useMemo(
    () =>
      show
        ? Object.values(
            entries
              .map(entry => entry.people)
              .flat(1)
              .concat(EntryPeople),
          )
        : [],
    [show, entries, EntryPeople],
  )

  const [suggestedPeople, frequentPeople] = useMemo(() => {
    if (!show) return [[], []]
    else {
      const h = html.toLowerCase()
      const t = title.toLowerCase()
      const f = TopKFrequentStrings(entryPeople, 'name')
        .filter(entryPersonName => {
          if (people.some(({ name }) => name == entryPersonName)) return false
          else if (!lastPeopleAsString) return true
          else if (stringMatch(entryPersonName, lastPeopleAsString)) return true
          else return false
        })
        .map(name => ({ name }))

      let suggestedPeople = []
      let frequentPeople = []

      for (let i = 0, { length } = f; i < length; i++) {
        const person = f[i]
        const names = person.name.split(' ')

        if (
          names.some(name => {
            const n = name.toLowerCase()
            return (n && h.includes(n)) || (t && t.includes(n))
          })
        ) {
          suggestedPeople.push(person)
        } else {
          frequentPeople.push(person)
        }
      }

      return [suggestedPeople, frequentPeople]
    }
  }, [show, html, title, entryPeople, people, lastPeopleAsString])

  const handlePeopleInputChange = useCallback(value => {
    const validatedTagsAsString = validatedPersonNameString(value)

    setState(prevState => ({
      ...prevState,
      personsName: validatedTagsAsString,
    }))
  }, [])

  const handleSavePeople = useCallback(() => {
    const payload = {
      id: entryId,
      people,
    }

    onChange(payload)
    resetState()
  }, [entryId, people, resetState])

  const handleAddPerson = useCallback(clickedName => {
    setState(prevState => {
      const newPeople = prevState.people.concat({ name: clickedName })
      const removeLastPerson = prevState.personsName.split(',').slice(0, -1)

      const newPersonsName = removeLastPerson.join(',')
      return {
        ...prevState,
        people: newPeople,
        personsName: newPersonsName,
      }
    })
  }, [])

  const handleRemovePerson = useCallback(clickedName => {
    setState(prevState => {
      const filteredPeople = prevState.people.filter(({ name }) => name != clickedName)
      return { ...prevState, people: filteredPeople }
    })
  }, [])

  const handleCreatePeople = useCallback(() => {
    setState(prevState => {
      const peopleFromString = validateTagOrPeopleString(splitPeopleAsString)
      const newPeople = removeAttributeDuplicates(prevState.people.concat(peopleFromString), 'name')

      return {
        ...getInitialState(prevState),
        people: newPeople,
      }
    })
  }, [splitPeopleAsString])

  const placeholder = useMemo(() => {
    const people = suggestedPeople.concat(frequentPeople)
    if (!show || people.length === 0) {
      return 'John Doe,Jane Doe'
    }

    return people
      .slice(0, 2)
      .map(({ name }) => name)
      .join(',')
  }, [suggestedPeople, frequentPeople])

  return (
    <ToolbarModal
      show={show}
      toggle={handleToogle}
      title='Add People'
      onSaveCallback={handleSavePeople}
      onCancelCallback={resetState}
      ButtonIcon='fas fa-users'
      button='Add People'
      xs={xs}
    >
      {show && (
        <Container className='PeopleButtonModal Container'>
          {suggestedPeople.length > 0 && (
            <Row className='TagAndPeopleContainer'>
              <h4>Suggested</h4>
              <TagsContainer
                tags={suggestedPeople}
                maxHeight={150}
                flexWrap='wrap'
                onClick={handleAddPerson}
                hoverable
                emptyString='No people found...'
                faIcon='fas fa-user-plus'
              />
            </Row>
          )}
          <Row className='TagAndPeopleContainer mt-2 mb-1'>
            <h4>Frequent</h4>
            <TagsContainer
              tags={frequentPeople}
              maxHeight={150}
              flexWrap='wrap'
              onClick={handleAddPerson}
              hoverable
              emptyString='No people found...'
              faIcon='fas fa-user-plus'
            />
          </Row>
          <Row className='TagAndPeopleContainer mt-2 mb-1'>
            <h4>Attached</h4>
            <TagsContainer
              tags={people}
              maxHeight={150}
              flexWrap='wrap'
              onClick={handleRemovePerson}
              hoverable
              emptyString='No people added...'
              faIcon='fas fa-user-times'
            />
          </Row>
          <Row>
            <Col className='EntryInput p-1' xs={12} tag={InputGroup}>
              <InputGroupAddon addonType='append'>
                <InputGroupText
                  tag={Button}
                  color='primary'
                  disabled={!personsName}
                  onClick={handleCreatePeople}
                >
                  <i
                    className='fas fa-user-plus'
                    style={{ fontSize: 20, color: 'var(--accentColor)' }}
                  />
                </InputGroupText>
              </InputGroupAddon>
              <DebounceInput
                value={personsName}
                onChange={handlePeopleInputChange}
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

PeopleButtonModal.propTypes = {
  UserId: PropTypes.number,
  entries: EntriesPropTypes,
  EntryPeople: EntryPeopleProps.isRequired,
  entryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  people: EntryPeopleProps.isRequired,
  GetUserEntryPeople: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
}

PeopleButtonModal.defaultProps = {
  people: [],
}

export default connect(mapStateToProps, mapDispatchToProps)(PeopleButtonModal)
