import React, { useCallback, useMemo } from 'react'
import { EntriesPropTypes } from 'redux/Entries/propTypes'
import { useSelector, useDispatch } from 'react-redux'
import { ConfirmAction } from 'components'
import { Button } from 'reactstrap'
import { UpdateReduxEntries, SyncEntries } from 'redux/Entries/actions'
import { selectedEntriesSelector, selectedItemsAreEqual } from 'components/EntryComponents/utils'

const ButtonDeleteEntries = ({ entries: entriesFromProps }) => {
  const { entriesSelected } = useSelector(selectedEntriesSelector, selectedItemsAreEqual)

  const dispatch = useDispatch()

  const entries = useMemo(() => entriesFromProps || entriesSelected, [
    entriesFromProps,
    entriesSelected,
  ])

  const handleDeleteEntries = useCallback(() => {
    const getUpdatedEntry = e => ({
      ...e,
      _shouldDelete: true,
      _shouldPost: false,
      _lastUpdated: null,
    })
    const payload =
      entries.length === 1
        ? getUpdatedEntry(entries[0])
        : entries.reduce((acc, e) => {
            acc[e.id] = getUpdatedEntry(e)
            return acc
          }, {})

    dispatch(UpdateReduxEntries(payload, null))

    dispatch(SyncEntries())
  }, [entries])

  const confirmationButton = useMemo(
    () => (
      <Button color='danger'>
        <i className='fas fa-trash-alt mr-1' />
        Delete
      </Button>
    ),
    [],
  )
  return (
    <ConfirmAction
      disabled={entries.length === 0}
      message={`Are you sure you want delete  ${
        entries.length === 1 ? 'this entry' : `these ${entries.length} entries`
      }?`}
      onConfirm={handleDeleteEntries}
      button={confirmationButton}
    />
  )
}

ButtonDeleteEntries.propTypes = {
  entries: EntriesPropTypes,
}

export default ButtonDeleteEntries
