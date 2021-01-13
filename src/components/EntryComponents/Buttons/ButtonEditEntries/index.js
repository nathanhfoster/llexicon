import React, { useState, useRef, useMemo, useCallback } from 'react'
import { EntriesPropTypes } from 'redux/Entries/propTypes'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import { BasicModal, BasicForm } from 'components'
import { Button } from 'reactstrap'
import { cleanObject, removeAttributeDuplicates } from 'utils'
import { getTagStringFromObject, getTagObjectFromString } from 'redux/Entries/utils'
import { UpdateReduxEntries, SyncEntries } from 'redux/Entries/actions'
import {
  selectedEntriesSelector,
  selectedItemsAreEqual,
} from 'components/EntryComponents/Buttons/utils'

const tagInputs = [
  [
    {
      label: 'Add',
      name: 'tagsAdd',
      type: 'radio',
      inline: true,
      defaultChecked: true,
    },
    {
      label: 'Delete',
      name: 'tagsDelete',
      type: 'radio',
      inline: true,
    },
  ],
]

const peopleInputs = [
  [
    {
      label: 'Add',
      name: 'peopleAdd',
      type: 'radio',
      inline: true,
      defaultChecked: true,
    },
    {
      label: 'Delete',
      name: 'peopleDelete',
      type: 'radio',
      inline: true,
    },
  ],
]

const ButtonEditEntries = ({ entries: entriesFromProps }) => {
  const { items, filteredItems, EntryTags, EntryPeople } = useSelector(
    ({ Entries: { items, filteredItems, EntryTags, EntryPeople } }) => ({
      items,
      filteredItems,
      EntryTags,
      EntryPeople,
    }),
    shallowEqual,
  )
  const { entriesSelected } = useSelector(selectedEntriesSelector, selectedItemsAreEqual)
  const entries = useMemo(() => entriesFromProps || entriesSelected, [
    entriesFromProps,
    entriesSelected,
  ])
  const dispatch = useDispatch()

  const [showEditModal, setShowEditModal] = useState(false)
  const tagsAdd = useRef(false)
  const tagsDelete = useRef(false)
  const peopleAdd = useRef(false)
  const peopleDelete = useRef(false)

  const resetRefs = () => {
    tagsAdd.current = false
    tagsDelete.current = false
    peopleAdd.current = false
    peopleDelete.current = false
  }

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
              })

              entry.people.forEach(({ name }) => {
                acc[1][name] = acc[1][name] + 1 || 1
              })

              return acc
            },
            [{}, {}],
          )
        : [{}, {}],
    [entries, showEditModal],
  )

  const handleTags = useCallback(({ target: { name, checked } }) => {
    switch (name) {
      case 'tagsAdd':
        tagsAdd.current = checked
        break

      case 'tagsDelete':
        tagsDelete.current = checked
        break

      case 'peopleAdd':
        peopleAdd.current = checked
        break

      case 'peopleDelete':
        peopleDelete.current = checked
        break

      default:
        return
    }
  }, [])

  const handleEditEntries = useCallback(
    formPayload => {
      let tagMap = {}
      let peopleMap = {}
      formPayload.tags = formPayload.tags?.reduce((acc, { value }) => {
        if (value) {
          tagMap[value] = true
          acc.push({ name: value })
        }
        return acc
      }, [])
      formPayload.people = formPayload.people?.reduce((acc, { value }) => {
        if (value) {
          peopleMap[value] = true
          acc.push({ name: value })
        }
        return acc
      }, [])

      let entryFieldsToUpdate = cleanObject(formPayload)

      const getUpdatedEntry = e => {
        if (tagsAdd.current) {
          entryFieldsToUpdate.tags = removeAttributeDuplicates(
            (entryFieldsToUpdate.tags || []).concat(e.tags),
            'name',
          )
        }
        if (Object.keys(tagMap).length > 0 && tagsDelete.current) {
          console.log(tagMap, e.tags)
          entryFieldsToUpdate.tags = e.tags.reduce((acc, t) => {
            if (!tagMap[t.name]) {
              acc.push(t)
            }
            return acc
          }, [])
        }

        if (peopleAdd.current) {
          entryFieldsToUpdate.people = removeAttributeDuplicates(
            (entryFieldsToUpdate.people || []).concat(e.people),
            'name',
          )
        }
        if (Object.keys(tagMap).length > 0 && peopleDelete.current) {
          entryFieldsToUpdate.people = e.people.reduce((acc, p) => {
            if (!peopleMap[p.name]) {
              acc.push(p)
            }
            return acc
          }, [])
        }

        return {
          ...e,
          ...entryFieldsToUpdate,
          _lastUpdated: new Date(),
        }
      }

      const payload =
        entries.length === 1
          ? getUpdatedEntry(entries[0])
          : entries.reduce((acc, e) => {
              acc[e.id] = getUpdatedEntry(e)
              return acc
            }, {})

      dispatch(UpdateReduxEntries(payload))

      setShowEditModal(false)

      dispatch(SyncEntries())
      resetRefs()
    },
    [entries],
  )

  const handleCancel = useCallback(() => {
    resetRefs()
    setShowEditModal(false)
  }, [])

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
          )
            .sort(({ name: a }, { name: b }) => a.localeCompare(b))
            .map(t => (entriesTagMap[t.name] === entries.length ? { ...t, selected: true } : t)),
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
          )
            .sort(({ name: a }, { name: b }) => a.localeCompare(b))
            .map(p => (entriesPeopleMap[p.name] === entries.length ? { ...p, selected: true } : p)),
          'name',
        )
      }
    }

    return [tagOptions, peopleOptions]
  }, [
    showEditModal,
    items,
    filteredItems,
    entries.length,
    EntryTags,
    EntryPeople,
    entriesTagMap,
    entriesPeopleMap,
  ])

  const inputs = useMemo(
    () => [
      [
        {
          label: (
            <div className='d-inline-flex'>
              <span className='mr-1'>Tags</span>
              <BasicForm inline inputs={tagInputs} onChange={handleTags} />
            </div>
          ),
          name: 'tags',
          type: 'select',
          options: entryTagsOptions,
          multiple: true,
          inline: true,
        },
        {
          label: (
            <div className='d-inline-flex'>
              <span className='mr-1'>People</span>
              <BasicForm inline inputs={peopleInputs} onChange={handleTags} />
            </div>
          ),
          name: 'people',
          type: 'select',
          options: entryPeopleOptions,
          multiple: true,
          inline: true,
        },
      ],
      {
        label: 'Should Post',
        name: '_shouldPost',
        type: 'checkbox',
        placeholder: `Should Post...`,
        inline: true,
        defaultChecked: entries.every(({ _shouldPost }) => _shouldPost),
      },
      {
        label: 'Should Delete',
        name: '_shouldDelete',
        type: 'checkbox',
        placeholder: `Sould Delete..`,
        inline: true,
        defaultChecked:
          !entries.every(({ _shouldPost }) => _shouldPost) &&
          entries.every(({ _shouldDelete }) => _shouldDelete),
      },
      {
        label: 'Is Public',
        name: 'is_public',
        type: 'checkbox',
        placeholder: `Is Public...`,
        inline: true,
        defaultChecked: entries.every(({ is_public }) => is_public),
      },
      {
        label: 'Title',
        name: 'title',
        type: 'text',
        placeholder: `Tile...`,
        autoComplete: 'on',
      },
      {
        label: 'HTML',
        name: 'html',
        type: 'textarea',
        placeholder: `Html...`,
        autoComplete: 'on',
      },
      {
        label: 'Date Created',
        name: 'date_created_by_author',
        type: 'datetime-local',
        placeholder: `Date Created...`,
        autoComplete: 'on',
      },
      [
        {
          label: 'Views',
          name: 'views',
          type: 'number',
          placeholder: '100',
          autoComplete: 'on',
          min: 0,
        },
        {
          label: 'Rating',
          name: 'rating',
          type: 'number',
          placeholder: '0',
          autoComplete: 'on',
          // defaultValue: 0,
          min: 0,
          max: 5,
        },
      ],
      {
        label: 'Address',
        name: 'address',
        type: 'text',
        placeholder: `Address...`,
        autoComplete: 'on',
      },
      [
        {
          label: 'Latitude',
          name: 'latitude',
          type: 'text',
          placeholder: `Latitude...`,
          autoComplete: 'on',
        },
        {
          label: 'Longitude',
          name: 'longitude',
          type: 'text',
          placeholder: `Longitude...`,
          autoComplete: 'on',
        },
      ],
    ],
    [entries, entryPeopleOptions, entryTagsOptions, handleTags],
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

ButtonEditEntries.propTypes = {
  entries: EntriesPropTypes,
}

export default ButtonEditEntries
