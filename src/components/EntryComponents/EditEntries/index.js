import React, { useState, useMemo, useCallback, memo } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { BasicModal, BasicForm } from 'components'
import { Button } from 'reactstrap'
import { cleanObject, removeAttributeDuplicates } from 'utils'
import { getTagStringFromObject, getTagObjectFromString } from 'redux/Entries/utils'
import { UpdateReduxEntries, SyncEntries } from 'redux/Entries/actions'
import { EntriesPropTypes } from 'redux/Entries/propTypes'
import InputGroup from 'reactstrap/lib/InputGroup'

const mapStateToProps = (
  { Entries: { items, filteredItems, EntryTags, EntryPeople } },
  { entries },
) => ({
  entries: entries || items.concat(filteredItems),
  items,
  filteredItems,
  EntryTags,
  EntryPeople,
})

const mapDispatchToProps = { UpdateReduxEntries, SyncEntries }

const EditEntries = ({
  entries,
  items,
  filteredItems,
  EntryTags,
  EntryPeople,
  UpdateReduxEntries,
  SyncEntries,
}) => {
  const [showEditModal, setShowEditModal] = useState(false)

  const modalButton = useMemo(
    () => (
      <Button color='accent' onClick={() => setShowEditModal(true)}>
        <i className='fas fa-edit mr-1' />
        Edit
      </Button>
    ),
    [],
  )

  const [entriesTagMap, entriesPeopleMap] = useMemo(
    () =>
      showEditModal && entries
        ? entries.reduce(
            (acc, entry) => {
              entry.tags.forEach(({ name }) => {
                acc[0][name] = acc[0][name] + 1 || 1

                entry.people.forEach(({ name }) => {
                  acc[1][name] = acc[0][name] + 1 || 1
                })
              })

              return acc
            },
            [{}, {}],
          )
        : [{}, {}],
    [entries, showEditModal],
  )

  const handleEditEntries = useCallback(
    formPayload => {
      formPayload.tags = formPayload.tags?.map(({ value }) => ({ name: value }))
      formPayload.people = formPayload.people?.map(({ value }) => ({ name: value }))

      const entryFieldsToUpdate = cleanObject(formPayload)

      const getUpdatedEntry = e => ({
        ...e,
        ...entryFieldsToUpdate,
      })

      const payload =
        entries.length === 1 ? getUpdatedEntry(entries[0]) : entries.map(e => getUpdatedEntry(e))

      entries.forEach(e => {
        UpdateReduxEntries(e.id, payload)
      })

      setShowEditModal(false)

      SyncEntries()
    },
    [SyncEntries, UpdateReduxEntries, entries],
  )

  const handleCancel = useCallback(() => setShowEditModal(false), [])

  const [entryTagsOptions, entryPeopleOptions] = useMemo(() => {
    let tagOptions = [
      { name: 'Document' },
      { name: 'Dream' },
      { name: 'Family' },
      { name: 'Friends' },
      { name: 'Quote' },
      { name: 'Vacation' },
    ]
    let peopleOptions = []

    if (showEditModal) {
      const reduxEntries = items.concat(filteredItems)

      if (entries.length > 0 || EntryTags.length > 0) {
        tagOptions = removeAttributeDuplicates(
          Object.values(
            reduxEntries
              .map(entry => entry.tags)
              .flat(1)
              .concat(EntryTags),
          ).map(t => (entriesTagMap[t.name] === entries.length ? { ...t, selected: true } : t)),
          'name',
        )
      }

      if (entries.length > 0 || EntryPeople.length > 0) {
        peopleOptions = removeAttributeDuplicates(
          Object.values(
            reduxEntries
              .map(entry => entry.people)
              .flat(1)
              .concat(EntryPeople),
          ).map(p => (entriesTagMap[p.name] === entries.length ? { ...p, selected: true } : p)),
          'name',
        )
      }
    }

    return [tagOptions, peopleOptions]
  }, [showEditModal, items, filteredItems, entries, EntryTags, EntryPeople])

  const inputs = useMemo(
    () => [
      {
        label: 'Should Delete',
        name: '_shouldDelete',
        type: 'switch',
        placeholder: `Sould Delete..`,
      },
      {
        label: 'Should Post',
        name: '_shouldPost',
        type: 'switch',
        placeholder: `Should Post...`,
      },
      {
        label: 'Is Public',
        name: 'is_public',
        type: 'switch',
        placeholder: `Is Public...`,
      },
      {
        label: 'Tags',
        name: 'tags',
        type: 'select',
        options: entryTagsOptions,
        multiple: true,
      },
      {
        label: 'People',
        name: 'people',
        type: 'select',
        options: entryPeopleOptions,
        multiple: true,
      },
      {
        label: 'Title',
        name: 'title',
        type: 'text',
        placeholder: `Tile...`,
      },
      {
        label: 'HTML',
        name: 'html',
        type: 'textarea',
        placeholder: `Html...`,
      },
      {
        label: 'Date Created',
        name: 'date_created_by_author',
        type: 'datetime-local',
        placeholder: `Date Created...`,
      },
      {
        label: 'Views',
        name: 'views',
        type: 'number',
        placeholder: '100',
        min: 0,
      },
      {
        label: 'Rating',
        name: 'rating',
        type: 'number',
        placeholder: '0',
        // defaultValue: 0,
        min: 0,
        max: 5,
      },
      {
        label: 'Address',
        name: 'address',
        type: 'text',
        placeholder: `Address...`,
      },
      {
        label: 'Latitude',
        name: 'latitude',
        type: 'text',
        placeholder: `Latitude...`,
      },
      {
        label: 'Longitude',
        name: 'longitude',
        type: 'text',
        placeholder: `Longitude...`,
      },
    ],
    [entryPeopleOptions, entryTagsOptions],
  )

  return (
    <BasicModal
      show={showEditModal}
      disabled={entries.length === 0}
      title={`Edit ${entries.length === 1 ? 'entry' : `these ${entries.length} entries`}`}
      button={modalButton}
      footer={null}
    >
      <BasicForm onSubmit={handleEditEntries} onCancel={handleCancel} inputs={inputs} />
    </BasicModal>
  )
}

EditEntries.propTypes = {
  entries: EntriesPropTypes,
}

EditEntries.defaultProps = {
  entries: [],
}

export default connect(mapStateToProps, mapDispatchToProps)(EditEntries)
